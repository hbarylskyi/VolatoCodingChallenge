import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';
import * as mathjs from 'mathjs';
import sha256 from 'crypto-js/sha256';

import {Picker} from '@react-native-picker/picker';

import {DataModelType} from './DataModel';
import dataModel1 from './dataModels/dataModel1.json';
import dataModel2 from './dataModels/dataModel2.json';
import Inputs, {CalculationResults} from './Inputs';
import {stringsToNums} from './stringsToNums';

const model1 = dataModel1 as unknown as DataModelType;
const model2 = dataModel2 as unknown as DataModelType;

function MainScreen() {
  const [selectedModelIndex, setSelectedModelIndex] = useState(1);
  const selectedModel = [model1, model2].find(
    model => model.index === selectedModelIndex,
  );

  let [results, setResults] = useState<CalculationResults>({});

  // data from inputs will be stored here
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({});

  // input/output field keys from data model will be stored here
  let selectedModelInputKeys: string[] = [];
  let selectedModelOutputKeys: string[] = [];

  if (selectedModel) {
    selectedModelInputKeys = Object.keys(selectedModel.inputs);

    // populate outputs array
    selectedModelOutputKeys = selectedModelInputKeys.filter(
      key => selectedModel.inputs[key].readOnly,
    );
  }

  function calculate() {
    let inputValuesArr = selectedModelInputKeys.map(
      inputKey => inputValues[inputKey],
    );

    let newResult = {...results};

    // go through each output field and calculate its value
    // based on currently selected model's inputs
    selectedModelOutputKeys.forEach(outputKey => {
      console.log('Calculating for ', outputKey);

      if (!selectedModel || inputValuesArr.length === 0) {
        return;
      }

      const output = selectedModel.inputs[outputKey];

      switch (output.calculate) {
        case 'sha256': {
          const sourceString = (inputValuesArr as string[]).concat().join('');

          const encrypted = sha256(sourceString).toString();

          newResult[outputKey] = encrypted;

          break;
        }
        case 'mean': {
          const mean = mathjs.mean(stringsToNums(inputValuesArr));

          newResult[outputKey] = mean;

          break;
        }
        case 'median': {
          const median = mathjs.median(stringsToNums(inputValuesArr));

          newResult[outputKey] = median;

          break;
        }
        case 'standardDeviation': {
          const stDev = mathjs.std(...stringsToNums(inputValuesArr));

          newResult[outputKey] = stDev;

          break;
        }
      }
    });

    setResults(newResult);
  }

  const storeInputValue = (newValue: string, inputKey: string) => {
    setInputValues({...inputValues, [inputKey]: newValue});
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.subtitle}>Pick the data model:</Text>
        <Picker
          selectedValue={selectedModelIndex}
          onValueChange={val => setSelectedModelIndex(val)}>
          <Picker.Item label={model1.name} value={model1.index} />
          <Picker.Item label={model2.name} value={model2.index} />
        </Picker>

        {selectedModel != null && (
          <Inputs
            onChangeText={storeInputValue}
            dataModel={selectedModel}
            results={results}
          />
        )}

        <View style={styles.calculateBtnContainer}>
          <Button title="Calculate" onPress={calculate} color="black" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 20,
    fontSize: 14,
    color: 'dimgray',
    alignSelf: 'center',
  },

  calculateBtnContainer: {marginVertical: 20},
});
