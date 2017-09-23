  import React, { PureComponent } from 'react';
  import { View, Text } from 'react-native';

  import styles from './styles';

  /**
    * @export @class InputBar
    * @extends PureComponent : used to avoid 'VirtualizedList: You have a large list that is slow to update'
    *                          an other performance issues
    * @desc          InputBar component
    */
  class BubbleMessage extends PureComponent {

    /** @method renderBubble
      * @return FlatList bubble based on owner prop
      */
    renderBubble() {
      const { owner } = this.props.message;
      if (owner === 'me') {
        return this.renderMyBubble();
      } else if (owner === 'stranger') {
        return this.renderStrangerBubble();
      }
    }

    /** @method renderMyBubble
      * @return User bubble message
      */
    renderMyBubble() {
      return (
        <View style={[styles.bubble, styles.myBubble]}>
          <Text style={[styles.bubbleText, styles.myBubbleText]}>{this.props.message.text}</Text>
        </View>
      );
    }


    /** @method renderStrangerBubble
      * @return Strange bubble message
      */
    renderStrangerBubble() {
        return (
          <View style={[styles.bubble, styles.strangerBubble]}>
            <Text style={[styles.bubbleText, styles.strangerBubbleText]}>{this.props.message.text}</Text>
          </View>
        );
    }

    render() {
      return (
        <View style={styles.bubbleContainer}>
          {this.renderBubble()}
        </View>
      );
    }
  }

  export default BubbleMessage;
