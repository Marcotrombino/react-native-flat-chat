
  import React, { Component } from 'react';
  import { View, Text, TouchableOpacity, TextInput } from 'react-native';

  import styles from './styles';

  /**
    * @export @class InputBar
    * @desc          InputBar component
    */
  export default class InputBar extends Component {
    state = {
      // TextInput value
        value: '',
      // TextInput escaped from empty lines
      escapedValue: '',
    };

    /** @method renderSendButton
      * @return A send button
      */
    renderSendButton() {
      // if the TextInput isn't empty
      if (this.state.value.replace(/\s+/g, '') !== '') {
        return (
          <TouchableOpacity
            onPress={() => {
              // clear TextInput
                this.textInput.setNativeProps({ text: '' });
              // send back to FlatChat the new message using nextKey passed through props and the escaped value
                this.props.onSend({ key: this.props.nextKey, owner: 'me', text: this.state.escapedValue });
              // clear state
                this.setState({ value: '', escapedValue: '' });
            }}
          >
          <View style={styles.sendButton}>
            <Text style={styles.sendText}>Invia</Text>
          </View>
          </TouchableOpacity>
        );
      }
    }

    render() {
      const { onBlur, onFocus } = this.props;
      return (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={'Digita un messaggio'}
            value={this.state.value}
            ref={component => { this.textInput = component; }}
            multiline
            onFocus={onFocus}
            onChangeText={(value) => {
              // escape TextInput value from empty lines
              const escapedValue = value.replace(/^\s*[\r\n]/gm, '');
                this.setState({ value, escapedValue });
            }}
            onBlur={onBlur}
          />

          {this.renderSendButton()}
        </View>
      );
    }
  }
