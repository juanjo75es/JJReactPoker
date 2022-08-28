export const combinations = (arr, min = 1, max) => {
    const combination = (arr, depth) => {
      if (depth === 1) {
        return arr;
      } else {
        const result = combination(arr, depth - 1).flatMap((val) =>
          arr.map((char) => val + char)
        );
        return arr.concat(result);
      }
    };
  
    return combination(arr, max).filter((val) => val.length >= min);
  };

export function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

export function straight_flush(hand)
{
    let r1=straight(hand)
    let r2=flush(hand)
    if(r1[0] && r2[0])
        return [true, r1[1], r2[1]];
    return [false]
}

export function poker(hand)
{
    return there_is_repetition(hand,4)
}

export function full_house(hand)
{
    let mymap=new Map()
    for(let i=0;i<5;i++)
    {
        let v=hand[i][1].toString()
        
        if(mymap.has(v)){
            mymap.set(v,mymap.get(v)+1)            
        }
        else
            mymap.set(v,1)
    }

    let v1=''
    let v2=''
    for (const [key, value] of mymap) {
        if(value!=2 && value!=3)
        {
            return [false]
        }
        {
            if(value==3)
                v1=key
            else
                v2=key            
        }
    }
    //console.log(mymap)
    return [true,{card1: v1, card2: v2}];
}

export function flush(hand)
{   
    let color=hand[0][0]
    for(let i=1;i<5;i++)
    {
        if(hand[i][0]!=color)
            return [false]
    }
    return [true,{color:color}];
}

export function straight(hand)
{
    //console.log(hand)
    hand=hand.sort(function (a, b) { return a.charCodeAt(1)-b.charCodeAt(1) })
    //console.log(hand)
    let prev=hand[0].charCodeAt(1)
    for(let i=1;i<5;i++)
    {
        if(i==4 && prev=='4'.charCodeAt(0) && hand[i].charCodeAt(1)=='E'.charCodeAt(0))
            return [true,{highest: '4'}];
        if(!(prev==hand[i].charCodeAt(1)-1 
            || (prev=='8'.charCodeAt(0) && hand[i].charCodeAt(1)=='A'.charCodeAt(0)) 
            || (prev=='E'.charCodeAt(0) && hand[i].charCodeAt(1)=='1'.charCodeAt(0))))
            return [false,i];    
        prev=hand[i].charCodeAt(1)
    }
    return [true,{highest: hand[4][1]}];
}

export function three_of_a_kind(hand)
{
    return there_is_repetition(hand,3)
}

export function two_pair(hand)
{
    let mymap=new Map()
    for(let i=0;i<5;i++)
    {
        let v=hand[i][1].toString()
        
        if(mymap.has(v)){
            mymap.set(v,mymap.get(v)+1)            
        }
        else
            mymap.set(v,1)
    }

    let n=0
    let v1=''
    let v2=''
    for (const [key, value] of mymap) {
        if(value==2)
        {
            if(n==0)
                v1=key
            else
                v2=key
            n++
        }
            
    }
    if(v2>v1){
        const x=v1
        v1=v2
        v2=x
    }
    //console.log(mymap)
    return [n==2,{card1: v1, card2: v2}];
}

function there_is_repetition(hand,n)
{
    let mymap=new Map()
    let max=0
    let maxv=''
    for(let i=0;i<5;i++)
    {
        let v=hand[i][1].toString()
        
        if(mymap.has(v)){
            mymap.set(v,mymap.get(v)+1)
            if(mymap.get(v)>max)
            {
                max=mymap.get(v)
                maxv=v
            }
        }
        else
            mymap.set(v,1)
    }
    //console.log(mymap)
    return [max==n,{card: maxv}];
}

export function one_pair(hand)
{
    return there_is_repetition(hand,2)
}

export function highest_card(hand1,exclude1,hand2,exclude2)
{
    //console.log(hand1)
    let fhand1=[]
    let fhand2=[]
    for(let i=0;i<5;i++)
    {
        if(!exclude1.includes(hand1[i][1]) ){
            fhand1.push(hand1[i])
        }
        if(!exclude2.includes(hand2[i][1]) ){
            fhand2.push(hand2[i])
        }
    }
    hand1=fhand1.sort(function (a, b) { return b.charCodeAt(1)-a.charCodeAt(1) })
    hand2=fhand2.sort(function (a, b) { return b.charCodeAt(1)-a.charCodeAt(1) })
    //console.log(hand1)
    //console.log(hand2)

    for(let i=0;i<hand1.length && i<hand2.length;i++)
    {
        if(hand1[i][1]>hand2[i][1])    
            return [1,["kicker",{card1: hand1[i][1], card2: hand2[i][1]}]]
        if(hand1[i][1]<hand2[i][1])    
            return [-1,["kicker",{card1: hand1[i][1], card2: hand2[i][1]}]]
    }
    return [0,["kicker"]]
}

function score_hand(hand)
{
    let score=straight_flush(hand)
    if(score[0])
    {
        return ["straight_flush", score]
    }
    score=poker(hand)
    if(score[0])
    {
        return ["poker", score]
    }
    score=full_house(hand)
    if(score[0])
    {
        return ["full_house", score]
    }
    score=flush(hand)
    if(score[0])
    {
        return ["flush", score]
    }
    score=straight(hand)
    if(score[0])
    {
        return ["straight", score]
    }
    score=three_of_a_kind(hand)
    if(score[0])
    {
        return ["three_of_a_kind", score]
    }
    score=two_pair(hand)
    if(score[0])
    {
        return ["two_pair", score]
    }
    score=one_pair(hand)
    if(score[0])
    {
        return ["one_pair", score]
    }
    return [""]
}

export function compare_hands(hand1,hand2)
{
    const score1=score_hand(hand1)
    const score2=score_hand(hand2)
    //console.log(JSON.stringify(score1))
    //console.log(JSON.stringify(score2))
    if(score1[0]=="straight_flush" && score2[0] == "straight_flush"){
        if(score1[1][1].highest>score2[1][1].highest)
            return [1,score1,score2]
        if(score1[1][1].highest<score2[1][1].highest)
            return [-1,score1,score2]                
        return [0,score1,score2]                
    }
    if(score1[0]=="straight_flush" && score2[0] != "straight_flush"){
        return [1,score1,score2]
    }    
    if(score1[0]=="poker"){        
        if(score2[0]=="straight_flush"){
            return [-1,score1,score2]
        }        
        if(score2[0]=="poker"){
            if(score1[1][1].card>score2[1][1].card)
                return [1,score1,score2]
            if(score1[1][1].card<score2[1][1].card)
                return [-1,score1,score2]                
            let x=highest_card(hand1,[score1[1][1].card],
                    hand2,[score2[1][1].card])
            return [x[0],score1,score2, x[1]]
        }            
        return [1,score1,score2]
    }
    if(score1[0]=="full_house"){
        
        if(score2[0]=="straight_flush")
            return [-1,score1,score2]
        if(score2[0]=="poker")
        return [-1,score1,score2]
        if(score2[0]=="full_house")
        {
            if(score1[1][1].card1>score2[1][1].card1)
                return [1,score1,score2]
            if(score1[1][1].card1<score2[1][1].card1)
                return [-1,score1,score2]                
            if(score1[1][1].card2>score2[1][1].card2)
                return [1,score1,score2]
            if(score1[1][1].card2<score2[1][1].card2)
                return [-1,score1,score2]                
            return [0,score1,score2]
        }
        return [1,score1,score2]
    }
    if(score1[0]=="flush"){
        if(score2[0]=="straight_flush")
        return [-1,score1,score2]
        if(score2[0]=="poker")
        return [-1,score1,score2]
        if(score2[0]=="full_house")
        return [-1,score1,score2]
        if(score2[0]=="flush")
        {
            let x=highest_card(hand1,[],
                hand2,[])
            return [x[0],score1,score2]
        }
        return [1,score1,score2]
    }
    if(score1[0]=="straight"){
        if(score2[0]=="straight_flush")
        return [-1,score1,score2]
        if(score2[0]=="poker")
        return [-1,score1,score2]
        if(score2[0]=="full_house")
        return [-1,score1,score2]
        if(score2[0]=="flush")
        return [-1,score1,score2]
        if(score2[0]=="straight")
        {
            if(score1[1][1].highest>score2[1][1].highest)
                return [1,score1,score2]
            if(score1[1][1].highest<score2[1][1].highest)
                return [-1,score1,score2]
            return [0,score1,score2]
        }        
        return [1,score1,score2]
    }
    if(score1[0]=="three_of_a_kind"){
        if(score2[0]=="straight_flush")
        return [-1,score1,score2]
        if(score2[0]=="poker")
        return [-1,score1,score2]
        if(score2[0]=="full_house")
        return [-1,score1,score2]
        if(score2[0]=="flush")
        return [-1,score1,score2]
        if(score2[0]=="straight")
        return [-1,score1,score2]
        if(score2[0]=="three_of_a_kind")
        {
            if(score1[1][1].card>score2[1][1].card)
            return [1,score1,score2]
            if(score1[1][1].card<score2[1][1].card)
            return [-1,score1,score2]
            let x=highest_card(hand1,[score1[1][1].card1,score1[1][1].card2],
                hand2,[score2[1][1].card1,score2[1][1].card2])
            return [x[0],score1,score2]
        }
        return [1,score1,score2]
    }
    if(score1[0]=="two_pair"){
        if(score2[0]=="straight_flush")
        return [-1,score1,score2]
        if(score2[0]=="poker")
        return [-1,score1,score2]
        if(score2[0]=="full_house")
        return [-1,score1,score2]
        if(score2[0]=="flush")
        return [-1,score1,score2]
        if(score2[0]=="straight")
        return [-1,score1,score2]
        if(score2[0]=="three_of_a_kind")
        return [-1,score1,score2]
        if(score2[0]=="two_pair")
        {
            if(score1[1][1].card1>score2[1][1].card1)
                return [1,score1,score2]
            if(score1[1][1].card1<score2[1][1].card1)
                return [-1,score1,score2]                
            if(score1[1][1].card2>score2[1][1].card2)
                return [1,score1,score2]
            if(score1[1][1].card2<score2[1][1].card2)
                return [-1,score1,score2]                
            let x=highest_card(hand1,[score1[1][1].card1,score1[1][1].card2],
                hand2,[score2[1][1].card1,score2[1][1].card2])
            return [x[0],score1,score2]
        }
        return [1,score1,score2]
    }
    if(score1[0]=="one_pair"){
        if(score2[0]=="straight_flush")
        return [-1,score1,score2]
        if(score2[0]=="poker")
        return [-1,score1,score2]
        if(score2[0]=="full_house")
        return [-1,score1,score2]
        if(score2[0]=="flush")
        return [-1,score1,score2]
        if(score2[0]=="straight")
        return [-1,score1,score2]
        if(score2[0]=="three_of_a_kind")
        return [-1,score1,score2]
        if(score2[0]=="two_pair")
        return [-1,score1,score2]
        if(score2[0]=="one_pair")
        {
            if(score1[1][1].card>score2[1][1].card)
                return [1,score1,score2]
            if(score1[1][1].card<score2[1][1].card)
                return [-1,score1,score2]                
            let x=highest_card(hand1,[score1[1][1].card],
                hand2,[score2[1][1].card])
            return [x[0],score1,score2]
        }
        
        return [1,score1,score2]
    }
    else{
        if(score2[0]=="straight_flush")
        return [-1,score1,score2]
        if(score2[0]=="poker")
        return [-1,score1,score2]
        if(score2[0]=="full_house")
        return [-1,score1,score2]
        if(score2[0]=="flush")
        return [-1,score1,score2]
        if(score2[0]=="straight")
        return [-1,score1,score2]
        if(score2[0]=="three_of_a_kind")
        return [-1,score1,score2]
        if(score2[0]=="two_pair")
        return [-1,score1,score2]
        if(score2[0]=="one_pair")
        return [-1,score1,score2]
        return highest_card(hand1,[],hand2,[])
    }
    
}

const getAllSubsets = 
      theArray => theArray.reduce(
        (subsets, value) => subsets.concat(
         subsets.map(set => [value,...set])
        ),
        [[]]
      );
      
export const getAllNSubsets = 
      theArray => {
        let results=[]
        let subsets=getAllSubsets(theArray)
        for(let i=0;i<subsets.length;i++){
          if(subsets[i].length==5)
            results.push(subsets[i])
        }
        return results
      }
