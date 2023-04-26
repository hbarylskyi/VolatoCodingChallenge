import React from 'react';
import {DataModelType} from './DataModel';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export type CalculationResults = {[key: string]: number | string};

interface Props {
  dataModel: DataModelType;
  results: CalculationResults;
  onChangeText: (newVal: string, inputKey: string) => void;
}

export default function Inputs({
  dataModel,
  onChangeText,
  results,
}: Props): JSX.Element {
  const inputKeys = Object.keys(dataModel.inputs);

  return (
    <View>
      {inputKeys.map(function (inputKey, inputIndex) {
        const field = dataModel.inputs[inputKey];
        const {readOnly} = field;

        let value;

        if (readOnly && results[inputKey]) {
          value = String(results[inputKey]);
        }

        let keyboardType: KeyboardTypeOptions = 'numeric';

        if (field.type === 'string') {
          keyboardType = 'default';
        }

        let maxLength;
        if (!readOnly) {
          maxLength = field.type === 'string' ? 36 : 6;
        }

        return (
          <View key={inputKey} style={styles.container}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              onChangeText={text => {
                onChangeText(text, inputKey);
              }}
              value={value}
              placeholder={field.readOnly ? 'Result' : `Input ${inputIndex}`}
              editable={!field.readOnly}
              keyboardType={keyboardType}
              autoComplete="off"
              autoCorrect={false}
              maxLength={maxLength}
              autoCapitalize="none"
              textAlign="left"
              multiline={readOnly}
              numberOfLines={2}
              style={[{borderBottomWidth: readOnly ? 0 : 1}, styles.input]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {margin: 10},

  label: {fontSize: 10, marginHorizontal: 4},

  input: {
    alignSelf: 'stretch',
    borderColor: 'gainsboro',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
});
