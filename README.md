#  Flat Chat [![GitHub version](https://badge.fury.io/gh/Marcotrombino%2Freact-native-flat-chat.svg)](https://badge.fury.io/gh/Marcotrombino%2Freact-native-flat-chat)
A powerfull React Native chat component without external dependencies.
###### <i>N.B: FlatChat is still under development and it's not ready for production yet. Feel free to test it and contribute.
## Why choose FlatChat</i>

- <b>Easy to use</b>: only need few lines to get started
- <b>No dependencies</b>: no third part component conflicts
- <b>Rich documentation</b>: no struggle trying to make it works
- <b>Elegant, clean and modern design</b>: no more old style chat, FlatChat uses a fresh design
- <b>:iphone: Native animations</b>: FlatChat mimics a <b>real native chat</b> using smooth animations
- <b>:rocket: High performance</b>: significant [performance improvement](https://facebook.github.io/react-native/blog/2017/03/13/better-list-views.html) with <b>`FlatList`</b> rather than `ScrollView` or `ListView`
- <b>Fully customizable</b>: easy customize FlatChat with your requirements
- <b>[Use case examples](./example)</b>: useful examples to find the perfect configuration
#### Other features:
- <b>Keyboard avoiding</b>
- <b>Avoid navigation bar height</b>
- <b>Multiline text input</b>
- <b>Messages filters</b>: regex messages to avoid black-list words, spam, etc

## Installation
- Using [npm](https://www.npmjs.com): `npm i --S react-native-flat-chat`

## Usage
1. Import <b>`FlatChat`</b> component:
```js
import { FlatChat } from 'react-native-flat-chat';
```
2. Use it in your `render()` method providing properties.
To make it works you need to pass two basic properties:
- `data` (Array): chat messages data from your state.
   <br>You can simply pass an empty array to make it starts with no messages or provide loaded messages
- `onSend` (function): callback called every time user sends a new message.

## Basic example
Here's a simple example of how your app scene should look like:
```js
import React, { Component } from 'react';
import { FlatChat } from 'react-native-flat-chat';

export default class MyChatScene extends Component {
  state = {
    data: [] // chat messages data
  };

  // push new message into data
  sendMessage(message) {
    // enable the following line to test both bubbles
    //message.owner = message.key % 2 === 0 ? 'me' : 'stranger';

    this.setState({ data: [...this.state.data, message] });
  }

  render() {
    <View style={{ flex: 1 }}>

      // my awesome FlatChat component
      <FlatChat
        data={this.state.data}
        // assign a callback which will be called every time user sends a new message
        onSend={() => this.sendMessage()}   
      />

    </View>
  }
}
```
### Other examples
Need more customization? You can find other useful examples [here](./example).

## FlatList `data` Array
According to [official documentation](https://facebook.github.io/react-native/docs/flatlist.html#renderitem) a `FlatList` (which is implemented inside FlatChat) takes <i>items</i> from a `data` <b>array</b>.
<br>A `data` <i>item</i> is an <b>Object</b> with the following properties:

```js
{
  key: (Number),    // item UNIQUE key
                    // e.g 10

  owner: (String)   // the message owner
                    // e.g "me" or "stranger"

  text: (String)    // the message text
                    // e.g "Hey, what's up?"
}
```

<b>N.B</b>: FlatChat manages new messages with key `data.length` to make a <b>unique key</b>.
<br>If you provide loaded messages inside <b>`state.data`</b> make sure they have progressive keys starting from `0`.

## API
Read the API documentation [here](./API.md)
