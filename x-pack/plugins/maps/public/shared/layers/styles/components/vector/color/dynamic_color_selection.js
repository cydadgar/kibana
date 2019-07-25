/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { dynamicColorShape } from '../style_option_shapes';
import { FieldSelect, fieldShape } from '../field_select';
import { ColorRampSelect } from './color_ramp_select';
import { EuiSpacer } from '@elastic/eui';

export function DynamicColorSelection({ ordinalFields, termFields, onChange, styleOptions }) {

  let fields = [];

  const updateFields = (color) => {
    const selectedField = _.get(styleOptions, 'field');
    if (color === 'Palette') {
      fields = termFields;
      if (selectedField && selectedField.type !== 'string') {
        styleOptions.field = undefined;
      }
    } else {
      fields = ordinalFields;
      if (selectedField && selectedField.type !== 'number') {
        styleOptions.field = undefined;
      }
    }
  };

  const onFieldChange = ({ field }) => {
    onChange({ ...styleOptions, field });
  };

  const onColorChange = ({ color }) => {
    onChange({ ...styleOptions, color });
    updateFields(color);
  };

  updateFields(styleOptions.color);

  return (
    <Fragment>
      <ColorRampSelect
        onChange={onColorChange}
        color={styleOptions.color}
      />
      <EuiSpacer size="s" />
      <FieldSelect
        fields={fields}
        selectedField={_.get(styleOptions, 'field')}
        onChange={onFieldChange}
      />
    </Fragment>
  );
}

DynamicColorSelection.propTypes = {
  ordinalFields: PropTypes.arrayOf(fieldShape),
  termFields: PropTypes.arrayOf(fieldShape),
  styleOptions: dynamicColorShape.isRequired,
  onChange: PropTypes.func.isRequired
};
