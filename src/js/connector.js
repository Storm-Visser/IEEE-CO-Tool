const axios = require('axios')
const GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg'
const {BASE_URL} = require('./constants')
const {appKey} = require('./constants')
const {appName} = require('./constants')
//const {appSecret} = require('./constants')
const { checkBoard, updateChildren } = require('./boardFunctions')
const {verifyCard, generateBadgeText} = require('./badgeFunctions')
const {calendarPopup} = require('./dateFunctions')
const {verifyRules } = require('./utils')
const openPopup = (t, opts) => {
  return t.popup({
    title: 'Cards',
    url: './popup.html',
    height: 350
  })
}

//link to the authorization
const showIframe = (t) => {
  return t.popup({
    title: 'Authorize to continue',
    url: './authorize.html'
  })
}

const authorize = (t) => {

}

const openDocumentation = (t) => {
  return t.modal({
    title: 'Help',
    url: './marked.html',
    fullscreen: true
  })
}

const openTimeline = (t) => {
  return t.modal({
    title: 'Conference Timeline',
    url: './timeline.html',
    fullscreen: true,
  })
}

// // authorise() opens popup to authorize.html, changed to showIFrame?
// window.TrelloPowerUp.initialize({ // uses the Trello REST API to customize capabilities, if authorised:
//   'card-buttons': function(t) {
//     return t.getRestApi()
//       .isAuthorized()
//       .then(function(isAuthorized) {
//         if (isAuthorized) {
//           return [{
//             text: 'Relative due date',
//             callback: openPopup,
//           }, 
//           {
//             text: 'CIS Timeline',
//             callback: openTimeline
//           }
//         ];
//         } else {
//           return [{
//             text: 'Relative due date',
//             callback: showIframe
//           }];
//         }
//       });
//     },
//   'card-badges': verifyCard,
//   'board-buttons': async (t, opts) => {
//       const isAuth = await t.getRestApi().isAuthorized()
//       if(isAuth) {
//         return [
//           {
//             text: 'Help',
//             callback: openDocumentation
//           },
//           {
//             text: 'CIS Timeline',
//             callback: openTimeline
//           }
//       ]
//       } else {
//         return [{
//             text: 'Authorize Power up',
//             callback: showIframe
//         }]
//       }
//   },
//   'on-enable': (t, opts) => {
//     return t.modal({
//       url: './popup.html',
//       height: 500,
//       title: 'Welcome to the Trello template for IEEE Conferences'
//     })
//   },
//   'card-detail-badges': async (t, opts) => {
//     const card = await t.card('all')
//     const board = await t.board('all')
//     const list = await t.list('name')
//     if (list.name === 'IEEE CIS Rules Summary') { 
//       await verifyRules(t, card, list)
//     }
    
//     const response = await axios(`/getcard?cardid=${card.id}&boardid=${board.id}`)
//     const relativeCard = response.data.card
//     if(relativeCard.parent) {
//       return [{ title: 'Parent', text: generateBadgeText(relativeCard) }]
//     } else {
//       return []
//     }
//   }
// },

window.TrelloPowerUp.initialize({
  // Capabilities
  'authorization-status': function(t, opts) {
    // Decide whether the user is authorized
    // e.g. check whether a token exists in Power-Up member-level storage
    return t.get('member', 'private', 'trelloToken')
      .then(token => {
        return { authorized: !!token };
      });
  },

  'show-authorization': function(t, opts) {
    // What to show when the user clicks “Authorize Power-Up”
    return t.popup({
      title: 'Authorize Power-Up',
      url: './authorize.html',
      height: 140,
    });
  },

  'card-buttons': function(t) {
    return t.isAuthorized().then(isAuth => {
      if (isAuth) {
        return [
          { text: 'Relative due date', callback: openPopup },
          { text: 'CIS Timeline', callback: openTimeline }
        ];
      } else {
        return [
          { text: 'Authorize Power-Up', callback: (t) => t.authorize() }
        ];
      }
    });
  },

  'board-buttons': async (t, opts) => {
    const isAuth = await t.isAuthorized();
    if (isAuth) {
      return [
        { text: 'Help', callback: openDocumentation },
        { text: 'CIS Timeline', callback: openTimeline }
      ];
    } else {
      return [
        { text: 'Authorize Power-Up', callback: (t) => t.authorize() }
      ];
    }
  },

  'card-detail-badges': async (t, opts) => {
    const card = await t.card('all')
    const board = await t.board('all')
    const list = await t.list('name')
    if (list.name === 'IEEE CIS Rules Summary') { 
      await verifyRules(t, card, list)
    }
    
    const response = await axios(`/getcard?cardid=${card.id}&boardid=${board.id}`)
    const relativeCard = response.data.card
    if(relativeCard.parent) {
      return [{ title: 'Parent', text: generateBadgeText(relativeCard) }]
    } else {
      return []
    }
  }
}, {
  appKey: appKey,
  appName: appName,
  //appSecret: appSecret, 
  appAuthor: 'IEEE'

});
//"Main function", maybe remove some functions