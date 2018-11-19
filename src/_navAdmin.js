
  export default {
    items: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-speedometer',
      },
      {
        name: 'Home',
        url: '/home',
        icon: 'icon-home',
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
        name: 'Data Caleg dan Parpol',
        wrapper: {            // optional wrapper object
          element: '',        // required valid HTML5 element tag
          attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
        },
        class: ''             // optional class names space delimited list for title item ex: "text-center"
      },
      {
        name: 'Data Pemilu',
        url: '/dashboard/data',
        icon: 'fa fa-archive ',
      }, 
    ],
  };

