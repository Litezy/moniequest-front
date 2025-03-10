import adidas from '../assets/images/giftcards/ADIDAS.png';
import amazon from '../assets/images/giftcards/AMAZON.png';
import americanExpress3779 from '../assets/images/giftcards/AMERICAN EXPRESS 3779.jpg';
import amexServe3777Or3751 from '../assets/images/giftcards/AMEX SERVE 3777 OR 3751.png';
import appleStore from '../assets/images/giftcards/APPLE STORE.png';
import bestBuy from '../assets/images/giftcards/BEST BUY.jpeg';
import bloomingdales from '../assets/images/giftcards/BLOOMINGDALES.jpg';
import cvsPharmacy from '../assets/images/giftcards/CVS PHARMACY.jpg';
import ebay from '../assets/images/giftcards/EBAY.jpg';
import footLocker from '../assets/images/giftcards/FOOT LOCKER.jpg';
import gamestop from '../assets/images/giftcards/GAMESTOP.jpg';
import googlePlay from '../assets/images/giftcards/GOOGLE PLAY.jpeg';
import homeDepot from '../assets/images/giftcards/HOME DEPOT.jpg';
import jcPenney from '../assets/images/giftcards/JC PENNEY.png';
import macys from "../assets/images/giftcards/MACY'S.jpg";
import imgmike from '../assets/images/giftcards/MICHAEL KORS.png';
import nordstrom from '../assets/images/giftcards/NORDSTROM.jpg';
import nike from '../assets/images/giftcards/NIKE.png';
import netflix from '../assets/images/giftcards/NETFLIX.jpg';
import netspend from '../assets/images/giftcards/NETSPEND.jpg';
import offgamers from '../assets/images/giftcards/OFFGAMERS.jpg';
import oneVanillaMastercard from '../assets/images/giftcards/ONE VANILLA MASTERCARD.jpg';
import oneVanillaVisa from '../assets/images/giftcards/ONE VANILLA VISA.jpg';
import paysafe from '../assets/images/giftcards/PAYSAFE.jpg';
import roblox from '../assets/images/giftcards/ROBLOX.jpg';
import saksFifthAvenue from '../assets/images/giftcards/SAKS FIFTH AVENUE.jpg';
import sephora from '../assets/images/giftcards/SEPHORA.png';
import steam from '../assets/images/giftcards/STEAM.jpg';
import target from '../assets/images/giftcards/TARGET.png';
import visa4030 from '../assets/images/giftcards/VISA 4030.jpg';
import visa4097 from '../assets/images/giftcards/VISA 4097.jpg';
import visa from '../assets/images/giftcards/VISA.jpg';
import walmart from '../assets/images/giftcards/WALMART.png';
import xbox from '../assets/images/giftcards/XBOX.png';






export const CardsArray = [
    { brand: "ADIDAS", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: adidas },
    { brand: "AMAZON", length: 15, regex: /^[A-Za-z0-9]{15}$/, image: amazon },
    { brand: "AMERICAN EXPRESS", length: 15, regex: /^[0-9]{15}$/, image: americanExpress3779 },
    { brand: "AMEX SERVE", length: 15, regex: /^[0-9]{15}$/, image: amexServe3777Or3751 },
    { brand: "APPLE STORE", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: appleStore },
    { brand: "BEST BUY", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: bestBuy },
    { brand: "BLOOMINGDALES", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: bloomingdales },
    { brand: "CVS PHARMACY", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: cvsPharmacy },
    { brand: "EBAY", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: ebay },
    { brand: "FOOT LOCKER", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: footLocker },
    { brand: "GAMESTOP", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: gamestop },
    { brand: "GOOGLE PLAY", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: googlePlay },
    { brand: "HOME DEPOT", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: homeDepot },
    { brand: "JC PENNEY", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: jcPenney },
    { brand: "MACY'S", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: macys },
    { brand: "MICHAEL KORS", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: imgmike },
    { brand: "NORDSTROM", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: nordstrom },
    { brand: "NIKE", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: nike },
    { brand: "NETFLIX", length: 12, regex: /^[A-Za-z0-9]{12}$/, image: netflix },
    { brand: "NETSPEND", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: netspend },
    { brand: "OFFGAMERS", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: offgamers },
    { brand: "ONE VANILLA MASTERCARD", length: 16, regex: /^[0-9]{16}$/, image: oneVanillaMastercard },
    { brand: "ONE VANILLA VISA", length: 16, regex: /^[0-9]{16}$/, image: oneVanillaVisa },
    { brand: "PAYSAFE", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: paysafe },
    { brand: "ROBLOX", length: 10, regex: /^[A-Za-z0-9]{10}$/, image: roblox },
    { brand: "SAKS FIFTH AVENUE", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: saksFifthAvenue },
    { brand: "SEPHORA", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: sephora },
    { brand: "STEAM", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: steam },
    { brand: "TARGET", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: target },
    { brand: "VISA 4030", length: 16, regex: /^[0-9]{16}$/, image: visa4030 },
    { brand: "VISA 4097", length: 16, regex: /^[0-9]{16}$/, image: visa4097 },
    { brand: "VISA", length: 16, regex: /^[0-9]{16}$/, image: visa },
    { brand: "WALMART", length: 16, regex: /^[A-Za-z0-9]{16}$/, image: walmart },
    { brand: "XBOX", length: 25, regex: /^[A-Za-z0-9]{25}$/, image: xbox }
  ];

  
  
  
  
  
  