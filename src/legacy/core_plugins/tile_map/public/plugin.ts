/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  CoreSetup,
  CoreStart,
  Plugin,
  PluginInitializerContext,
  UiSettingsClientContract,
} from '../../../../core/public';
import { Plugin as DataPublicPlugin } from '../../../../plugins/data/public';
import { VisualizationsSetup } from '../../visualizations/public/np_ready/public';

import { LegacyDependenciesPlugin, LegacyDependenciesPluginSetup } from './shim';

// @ts-ignore
import { createTileMapFn } from './tile_map_fn';
// @ts-ignore
import { createTileMapTypeDefinition } from './tile_map_type';

/** @private */
interface TileMapVisualizationDependencies extends LegacyDependenciesPluginSetup {
  uiSettings: UiSettingsClientContract;
}

/** @internal */
export interface TileMapPluginSetupDependencies {
  data: ReturnType<DataPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  __LEGACY: LegacyDependenciesPlugin;
}

/** @internal */
export class TileMapPlugin implements Plugin<Promise<void>, void> {
  initializerContext: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public async setup(
    core: CoreSetup,
    { data, visualizations, __LEGACY }: TileMapPluginSetupDependencies
  ) {
    const visualizationDependencies: Readonly<TileMapVisualizationDependencies> = {
      uiSettings: core.uiSettings,
      ...(await __LEGACY.setup()),
    };

    data.expressions.registerFunction(() => createTileMapFn(visualizationDependencies));

    visualizations.types.registerVisualization(() =>
      createTileMapTypeDefinition(visualizationDependencies)
    );
  }

  public start(core: CoreStart) {
    // nothing to do here yet
  }
}
