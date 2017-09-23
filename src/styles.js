
  import { Dimensions } from 'react-native';

  // get window width to set max bubble width
  const windowWidth = Dimensions.get('window').width;

  export default {
    flatChatHeight: {
      flex: 1
    },

    /*
     *****************************
     * Bubble settings
     */

     messagesContainer: {
       flex: 1,
     },

    bubbleContainer: {
      minHeight: 50,
      justifyContent: 'center'
    },

    // Bubbles

    bubble: {
      minHeight: 35,
      minWidth: 50,
      maxWidth: windowWidth / 1.5,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 10
    },

    myBubble: {
      alignSelf: 'flex-end',
      marginRight: 20,
      borderBottomRightRadius: 5,
      backgroundColor: '#5756ea',
    },

    strangerBubble: {
      alignSelf: 'flex-start',
      marginLeft: 20,
      borderBottomLeftRadius: 5,
      backgroundColor: '#ededed'
    },

    // Bubbles text

    bubbleText: {
      alignSelf: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: 'transparent'
    },

    myBubbleText: {
      color: '#ffffff'
    },

    strangerBubbleText: {
      color: '#424242'
    },

    /*
     *****************************
     * Input bar settings
     */

    inputContainer: {
      flexDirection: 'row',
      minHeight: 50,
    },

    input: {
      flex: 1,
      minHeight: 50,
      maxHeight: 120,
      paddingTop: 15,
      paddingBottom: 5,
      paddingLeft: 20,
      paddingRight: 10,
      fontSize: 16,
      color: '#000000',
    },

    sendButton: {
      height: 50,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },

    sendText: {
      color: '#a159df',
      fontSize: 16,
      fontWeight: 'bold',
      paddingLeft: 10,
      paddingRight: 20,
    }
  };
