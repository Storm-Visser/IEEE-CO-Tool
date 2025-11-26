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

window.TrelloPowerUp.initialize({
  // Capabilities
  'authorization-status': function(t, opts) {
    // Check whether the user is authorized
    // e.g. check whether a token exists in Power-Up member-level storage
    return t.get('member', 'private', 'authToken')
    .then(function(authToken) {
      return { authorized: authToken != null }
    });
  },

  'show-authorization': function(t, opts) {
    // What to show when the user clicks “Authorize Power-Up”
    return t.popup({
      title: 'Authorize Power-Up',
      url: 'https://relative-due-date.idi.ntnu.no/authorize.html',
      height: 140,
    });
  },

  'board-buttons': async function(t) {
    const token = await t.get('member', 'private', 'authToken');
    
    if (token) {
      // User already authorized
      return [
        { text: 'Help', callback: openDocumentation },
        { text: 'CIS Timeline', callback: openTimeline }
      ];
    } else {
      // User not authorized → authorize
      return t.popup({
        title: 'Authorize Power-Up',
        url: 'https://relative-due-date.idi.ntnu.no/authorize.html',
        height: 140,
      });
    }
  },
  
  'card-buttons': async function(t) {
    const token = await t.get('member', 'private', 'authToken');
    console.log(t)
    if (token) {
      return [
        { text: 'Relative due date', callback: openPopup },
        { text: 'CIS Timeline', callback: openTimeline }
      ];
    } else {
      // User not authorized → authorize
      return t.popup({
        title: 'Authorize Power-Up',
        url: 'https://relative-due-date.idi.ntnu.no/authorize.html',
        height: 140,
      });
    }
  },


  'card-detail-badges': async (t, opts) => {
    const card = await t.card('all')
    const board = await t.board('all')
    const list = await t.list('name')
    if (list){
      if (list.name === 'IEEE CIS Rules Summary') { 
        await verifyRules(t, card, list)
      }
    } else {
      console.log("list not found", { card, board, t })
    }
    
    
    const response = await axios(`/getcard?cardid=${card.id}&boardid=${board.id}`)
    const relativeCard = response.data.card
    if(relativeCard && relativeCard.parent) {
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