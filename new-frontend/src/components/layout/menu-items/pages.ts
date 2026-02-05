// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  caption: 'Pages Caption',
  icon: icons.IconKey,
  type: 'group',
  children: [
    {
      id: 'editor',
      title: 'Editor',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        // {
        //   id: 'login',
        //   title: 'login',
        //   type: 'item',
        //   url: '/pages/app/login',
        //   target: true
        // },
        // {
        //   id: 'register',
        //   title: 'register',
        //   type: 'item',
        //   url: '/pages/register',
        //   target: true
        // }
      ]
    }
  ]
};

export default pages;
