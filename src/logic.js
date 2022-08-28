import * as utils from './utils.js';

export const NPLAYERS=4
export const INITIAL_BET=100
export const NSTATES=11

export class GameState
{
    constructor(players){
        this.screen="start"
        this.button = 0
        this.call = INITIAL_BET
        this.total_pot = 0
        this.speaking_player = 1
        this.players_asked = 0
        this.stage = 0
        this.hand_cards = []
        this.player_cards = [[],[],[],[]]
        this.players = players
        this.available_cards = shuffle_cards()
        this.bListening = false
    }

    
}

function select_best_hand(cards)
{  
  //console.log("cards: "+JSON.stringify(cards))
  const hands=utils.getAllNSubsets(cards,5)
  //console.log("hands: "+JSON.stringify(hands))
  let best=hands[0]
  for(let i=1;i<hands.length;i++)
  {
    let c=utils.compare_hands(hands[i],best)[0]
    if(c>0){
      best=hands[i]
    }
  }
  //console.log("best hand: "+JSON.stringify(best))
  return best
}


export function shuffle_cards()
{
  let available_cards=[]
  for(let i=1;i<9;i++)
  {
    available_cards.push('H'+i);
    available_cards.push('C'+i);
    available_cards.push('D'+i);
    available_cards.push('S'+i);
  }
  available_cards.push('HA');
  available_cards.push('CA');
  available_cards.push('DA');
  available_cards.push('SA');
  available_cards.push('HB');
  available_cards.push('CB');
  available_cards.push('DB');
  available_cards.push('SB');
  available_cards.push('HC');
  available_cards.push('CC');
  available_cards.push('DC');
  available_cards.push('SC');
  available_cards.push('HD');
  available_cards.push('CD');
  available_cards.push('DD');
  available_cards.push('SD');
  available_cards.push('HE');
  available_cards.push('CE');
  available_cards.push('DE');
  available_cards.push('SE');
  utils.shuffle(available_cards);

  return available_cards
}


function mybet(state, player_id, amount)
{
  state.players[player_id].money-=amount;
  state.players[player_id].bet+=amount;
  state.total_pot+=amount;
  //if it's all in
  //do something

  if(state.players[player_id].bet>state.call){
    state.call=state.players[player_id].bet
  }
  return state
}

export function force_bet(state,player_id,amount)
{
    state=mybet(state,player_id,Math.min(500,amount))

    return state;
}


export function computer_bet(state,player_id)
{
    const audio = new Audio("./sounds/158166-Door-Wood-Bathroom-Exterior_POV-Knock-x2-Concise.mp3")
    const audio2 = new Audio("./sounds/201805__fartheststar__poker-chips3.wav")
    const audio3 = new Audio("./sounds/201807__fartheststar__poker-chips1.wav")
    let bet=state.call-state.players[player_id].bet
    let plus=0
    if(bet>0)
    {
      let x=2000-Math.min(1500,bet)
      let n=Math.random()*1000
      if(n>x)
      {
        state.players[player_id].playing=false
        return state
      }
    }
    if(parseInt(Math.random()*4)==0)
      plus=parseInt(Math.random()*1500)
    /*if(bet<100)
        state=mybet(state,player_id,Math.min(500,state.call-bet+75))
    else
        state=mybet(state,player_id,state.call-bet)*/

    /*if(plus==0)
    {
      if(bet==0)
        audio.play()
      else
        audio2.play()
    }
    else
      audio3.play()*/
    state=mybet(state,player_id,bet+plus)

    return state;
}

export function fold(state)
{
    state.players[0].playing=false
    return state
}

export function check(state)
{
    let bet=state.players[0].bet
    state=mybet(state,0,state.call-bet)
    return state
}

export function raise(state, amount)
{
    let bet=state.players[0].bet
    state=mybet(state,0,state.call-bet+amount)
    return state
}

export function human_bet(state,player_id)
{
    return state
}


export function round_ended(state)
{
    let no_calls_pending=true
    let n_players=0
    for(let i=0;i<NPLAYERS;i++)
    {
        if(state.players[i].playing)
        {
          n_players++
          no_calls_pending=no_calls_pending && state.players[i].bet==state.call
        }
    }
    return (n_players==1 || state.players_asked>=n_players && no_calls_pending)
}

export function next_player_speaks(state)
{
    state.speaking_player=(state.speaking_player+1)%NPLAYERS
    state.players_asked++

    return state
}

export function listen_players(state)
{
  
  while(!state.players[state.speaking_player].playing && ! round_ended(state))
  {
    state.speaking_player=(state.speaking_player+1)%NPLAYERS    
  }
  
  //while(state.speaking_player!=0 && !round_ended(state))
  if(!round_ended(state))
  {
    if(state.speaking_player==0){
        //state=human_bet(state,state.speaking_player)
    }
    else{
        state=computer_bet(state,state.speaking_player)
    }
    
  }

  /*if(state.speaking_player==0){
    state=human_bet(state,state.speaking_player,200)
    state.speaking_player=(state.speaking_player+1)%NPLAYERS  
    state.players_asked++
  }*/

  

  state.bListening=!round_ended(state)

  return state
}

export function reward_winners(state)
{
  let players_hand=[]
  for(let i=0;i<NPLAYERS;i++)
  {
    let cards=[...state.hand_cards]
    cards=cards.concat(state.player_cards[i])
    //console.log(cards)
    players_hand[i]=select_best_hand(cards)
    //console.log("player hand "+i+": "+JSON.stringify(state.player_cards[i]))
    //console.log("best hand "+i+": "+JSON.stringify(players_hand[i]))
    state.players[i].best_hand=players_hand[i]
  }
  let max_hands=[0]
  let max_hand=players_hand[0]
  let j=0
  while(!state.players[j].playing){
    j=j+1
    max_hands=[j]
    max_hand=players_hand[j]
    
  }
  for(let i=j+1;i<NPLAYERS;i++)
  {
    if(state.players[i].playing)
    {
      //console.log("comparing "+JSON.stringify(players_hand[i])+" "+JSON.stringify(max_hand))
      const c=utils.compare_hands(players_hand[i],max_hand)
      //console.log(JSON.stringify(c))
      if(c[0]==0){
        max_hands.push(i)
      }
      else if (c[0]>0){
        max_hands=[i]
        max_hand=players_hand[i]
      }
    }
  }
  //console.log("maxhands: "+JSON.stringify(max_hands))
  let human_won=false
  for(let i=0;i<max_hands.length;i++){
    let a=Math.floor(state.total_pot/max_hands.length)
    state.players[max_hands[i]].money+=a;
    state.players[max_hands[i]].won=a
    if(max_hands[i]==0)
      human_won=true
  }
  if(human_won)
  {
    const audio=new Audio("./sounds/403314-Epic_Heroic_Win_Celebration_Tune_Sting_-Payout_with_Counter_Rollups_Level_1_005164_.mp3")
    audio.play()
  }
  state.total_pot=0
  return state
}

export function game_over(state)
{
  state.screen="gameover"
  return state
}

export function victory(state){
  state.screen="victory"
  return state
}