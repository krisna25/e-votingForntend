
import {tokenAuth} from './middleware/cookies-manager';
const userData= tokenAuth.tokenAuthenticated();

if (userData.authToken === true) {}
  export default {
    items: [
      {
        name: 'Home',
        url: '/home',
        icon: 'icon-home',
      },
      {
        title: true,
        name: 'Vote',
        wrapper: {            // optional wrapper object
          element: '',        // required valid HTML5 element tag
          attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
        },
        class: ''             // optional class names space delimited list for title item ex: "text-center"
      },
      {
        name: 'Vote',
        url: '/dashboard/vote',
        icon: 'cui-box icons',
        badge: {
          variant: 'info',
          text: 'VOTE DISINI',
        },
      },
      {
        title: true,
        name: 'Hasil',
        wrapper: {            // optional wrapper object
          element: '',        // required valid HTML5 element tag
          attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
        },
        class: ''             // optional class names space delimited list for title item ex: "text-center"
      },
      {
        name: 'Hasil',
        url: '/home/hasil',
        icon: 'fa fa-archive ',
        badge: {
          variant: 'info',
          text: 'Lihat hasil',
        },
      },
      {
        title: true,
        name: 'Info Pemilu',
        wrapper: {            // optional wrapper object
          element: '',        // required valid HTML5 element tag
          attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
        },
        class: ''             // optional class names space delimited list for title item ex: "text-center"
      },
      {
        name: 'Info Pemilu',
        url: 'https://infopemilu.kpu.go.id/',
        icon: 'fa fa-archive ',
      },
    ],
  };

