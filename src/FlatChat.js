
  /**@class FlatChat
   * @author: Marco Trombino
   * @version: 0.1.0 Last update: 09-23-2017
   * @see https://github.com/Marcotrombino/react-native-flat-chat
   * @license GPL-3.0
   * This program is free software: you can redistribute it and/or modify
   * it under the terms of the GNU General Public License as published by
   * the Free Software Foundation, either version 3 of the License, or
   * (at your option) any later version.
   * This program is distributed in the hope that it will be useful,
   * but WITHOUT ANY WARRANTY; without even the implied warranty of
   * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   * GNU General Public License for more details.
   * You should have received a copy of the GNU General Public License
   * along with this program.  If not, see http://www.gnu.org/licenses.
   */

   import React, { Component } from 'react';
   import {
     Dimensions,
     Animated,
     FlatList,
     KeyboardAvoidingView,
     Keyboard,
     Platform
   } from 'react-native';

   import Bubble from './Bubble';
   import InputBar from './InputBar';


   // get device OS
    const OS = Platform.OS;
   // get OS navigation bar height
    const NAVIGATION_HEIGHT = OS === 'ios' ? 64 : 54;
   // get window height
    const WINDOW_HEIGHT = Dimensions.get('window').height;

   /**
     * @export @class FlatChat
     * @desc          FlatChat component
     */
   export default class FlatChat extends Component {
     constructor(props) {
       super(props);

       const {
         data,
         chatVerticalOffset,
         fixNavBarOffset,
         scrollOnKeyboardShow
       } = this.props;

       // get navigation bar height based on 'fixNavBarOffset' prop
       const navigationHeight = fixNavBarOffset ? NAVIGATION_HEIGHT : 0;
       // get FlatChat vertical offset to allow extra space on top
       const verticalOffset = (chatVerticalOffset || 0) + navigationHeight;

        this.state = {
          /* -----------------------------------------------------
           * Settings based on props
           */

           // FlatList data
           data,

            // flags based on 'scrollBottomOnKeyboardShow' prop type
              scrollOnKeyboardShowBottomStart: scrollOnKeyboardShow === 'bottom-start',
              scrollOnKeyboardShowBottomEnd: scrollOnKeyboardShow === 'bottom-end',
              scrollOnKeyboardShowKeepItem: scrollOnKeyboardShow === 'keep-item',

          /* -----------------------------------------------------
           * FlatChat layout settings
           */

            // manage keyboard status
              activeKeyboard: false,

            // manage FlatList scroll position on onScroll event
              scrollPosition: 0,

            // manage FlatList layout to get scroll max position (scrollLimit)
              contentSize: 0,
              layoutHeight: 0,


            // FlatChat layout variables
              flatListOffset: verticalOffset,
              flatListHeight: WINDOW_HEIGHT - verticalOffset,
              listHeight: new Animated.Value(WINDOW_HEIGHT - verticalOffset),

        };
     }


     /** @override
       * @method componentWillMount (React Lifecycle method)
       * @fires @event keyboardWillShow   @callback this.keyboardWillShow
       * @fires @event keyboardWillHide   @callback this.keyboardWillHide
       *
       * @desc Adding keyboard's event listeners
       *       to synchronize Flatlist resizing and keyboard animations
       */
     componentWillMount() {
       this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
       this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
       this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
       this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
     }


     /** @override
       * @method componentWillReceiveProps (React Lifecycle method)
       * @desc   Update data state every time the related parent prop changes
       */
     componentWillReceiveProps({ data }) {
       if (this.state.length !== data.length) {
         this.setState({ data });
       }
     }


     /** @method componentDidUpdate (React Lifecycle method)
       * @desc   Scroll the FlatList to the end every time
       *         a new message is pushed into 'data'
       */
     componentDidUpdate(prevProps, prevState) {
       if (prevState.data.length !== this.state.data.length) {
        this.scroller.scrollToEnd();
       }
     }


     /** @method componentWillUnmount (React Lifecycle method)
       * @desc   Remove keyboard's event listeners before the component unmounts
       */
     componentWillUnmount() {
       this.keyboardWillShowListener.remove();
       this.keyboardWillHideListener.remove();
       this.keyboardDidShowListener.remove();
       this.keyboardDidHideListener.remove();
     }


     /**  @method @callback keyboardWillShow
       *  @param  {Object} e : Keyboard event
       *  @desc   Fired by keyboardWillShow listener when keyboard show animation will start
       */
     keyboardWillShow(e) {
       const { listHeight, flatListHeight, scrollOnKeyboardShowBottomStart } = this.state;
       const keyboardHeight = e.endCoordinates.height;

       /** @prop @type scrollOnKeyboardShow = "bottom-start"
         * Track listHeight animated value scrolling to bottom until animation ends
         */
       if (scrollOnKeyboardShowBottomStart) {
         listHeight.addListener(() => this.scroller.scrollToEnd());
       } else

       /** @prop @type scrollOnKeyboardShow = "keep-item"
         * Scroll to item position
         */
       if (this.state.scrollOnKeyboardShowKeepItem) {
        this.scroller.scrollToOffset({ offset: this.state.scrollPosition + e.endCoordinates.height, animated: true });
       }

       /*************************** FLATLIST ANIMATION  */

       Animated.timing(listHeight, {
        // animate the FlatList height to his initial minus the keyboard height
          toValue: flatListHeight - keyboardHeight,
        // uses the keyboard animation timing to be synchronized
          duration: e.duration

          // scroll to the end when animation is finished
       }).start(() => {
         /** remove all listHeight listeners if @prop @type scrollOnKeyboardShow = "bottom-start" */
         if (this.state.scrollOnKeyboardShowBottomStart) {
           this.state.listHeight.removeAllListeners();
         }
       });
     }


     /**  @method @callback keyboardDidShow
       *  @desc   Fired by keyboardDidShow listener when keyboard show animation is completed
       */
     keyboardDidShow() {
       this.setState({ activeKeyboard: true });

       /** @prop @type scrollOnKeyboardShow = "bottom-end"
         * Scroll to the end when keyboard show animation is finished
         */
       if (this.state.scrollOnKeyboardShowBottomEnd) {
         this.scroller.scrollToEnd();
       }
     }


     /**  @method @callback keyboardWillHide
       *  @param  {Object} e : Keyboard event
       *  @desc   Fired by keyboardWillHide listener when keyboard hide animation will start
       */
     keyboardWillHide(e) {
      const { listHeight, flatListHeight, scrollPosition, contentSize, layoutHeight } = this.state;

      /** @prop @type scrollOnKeyboardShow = "keep-item"
        * Scroll back to item position
        */
      if (this.state.scrollOnKeyboardShowKeepItem) {
        // manage FlatList layout to get scroll max position
        const scrollLimit = contentSize - layoutHeight;

        const keyboardHeight = e.endCoordinates.height;

        // detect if FlatList has to scroll back as much as it scrolled initially
        const nextKeepItemScroll = (scrollPosition + keyboardHeight) - 10;

        // if scrollPosition is little, just scroll to the top
        if (scrollPosition < e.endCoordinates.height) {
          this.scroller.scrollToOffset({ offset: 0, animated: true, duration: e.duration });
        } else
        // if scrollPosition isn't too near to the end, scroll back as much as scrolled initially
        if (nextKeepItemScroll < scrollLimit) {
          this.scroller.scrollToOffset({ offset: scrollPosition - keyboardHeight, animated: true, duration: e.duration });
        }

        /* if scrollPosition is near to the end, just delegate the scroll to KeyboardAvoidingView
           TODO: implement and test case
           this.scroller.scrollToOffset({offset: scrollPosition, animated: true, duration: e.duration});
        */
      }


      /*************************** FLATLIST ANIMATION  */

      Animated.timing(listHeight, {
        // animate the FlatList height to his initial height
          toValue: flatListHeight,
        // fixer to speed up the resizing animation on closing keyboard
          duration: e.duration - 150
      }).start();
     }


     /**  @method @callback keyboardDidHide
       *  @desc   Fired by keyboardDidHide listener when keyboard hide animation is completed
       */
     keyboardDidHide() {
       this.setState({ activeKeyboard: false });
     }


     /**  @method updateScrollPosition
       *  @param  {Object} e : Keyboard event
       *  @desc   Update scrollPosition state at every scroll event based on a sensibility
       */
     updateScrollPosition(e) {
       const scrollPosition = this.state.scrollPosition;
       const currentScrollPos = e.nativeEvent.contentOffset.y;

       // ignore negative scroll positions in case of iOS momentum or bugs
       if (currentScrollPos >= 0) {
         const sensitivity = 10;
         const scrollPositionOffset = (currentScrollPos - scrollPosition);

         /** if the difference beetween the previous and the current scroll position go over the threshold
          *  update che scrollPosition state with the new value
          *  @see https://github.com/facebook/react-native/issues/2228
          */
         if (Math.abs(scrollPositionOffset) > sensitivity) {
           this.setState({ scrollPosition: currentScrollPos });
         }
       }
     }


     /**  @method updateLayoutHeight
       *  @param  {Object} e : Keyboard event
       *  @desc   Update contentSize state at every layoutHeight change (Animated.View resize)
       */
     updateLayoutHeight(e) {
       this.setState({ layoutHeight: e.nativeEvent.layout.height });
     }


     /**  @method updateContentSize
       *  @param  {Object} e : Keyboard event
       *  @desc   Update contentSize state at every contentSize change (new message pushed into 'data')
       */
     updateContentSize(w, h) {
       this.setState({ contentSize: h });
     }


     /**  @method render
       *  @desc   Render FlatChat which includes a <FlatList> and a <InputContainer>
       */
     render() {
       const {
         data,
         onSend
       } = this.props;

       return (
         <KeyboardAvoidingView style={{ height: this.state.flatListHeight }} behavior='padding'>

           {/*
             * FlatList View with animated height based on keyboard events
             **/}
           <Animated.View style={{ position: 'relative', height: this.state.listHeight }}>

             <FlatList
               // FlatList reference to scroll it when necessary
                ref={(ref) => { this.scroller = ref; }}
               // get data from props
                data={data}
               // render every message from data with <Bubble />
                renderItem={({ item }) => <Bubble message={item} />}
               // keep trace of scroll position
                onScroll={e => this.updateScrollPosition(e)}
               // keep trace of layout height
                onLayout={e => this.updateLayoutHeight(e)}
               // keep trace of contentSize
                onContentSizeChange={(w, h) => this.updateContentSize(w, h)}
             />

             {/* InputContainer which contains the TextInput and the send button */}
             <InputBar
                // key used for new message
                  nextKey={this.state.data.length}
                // onSend callback from parent
                onSend={onSend}
             />
           </Animated.View>

         </KeyboardAvoidingView>
         );
     }
   }
