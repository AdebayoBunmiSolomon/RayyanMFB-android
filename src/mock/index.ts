const phoneNumber = '2349049712650';
const emailAddress = 'customercare@rayyanbank.com.ng';
// icons
import BoxIcon from '../assets/svg/3d_box_light.svg';
import HomeIcon from '../assets/svg/house-2.svg';
import Mortarboard from '../assets/svg/Mortarboard_alt_light.svg';
import UserIcon from '../assets/svg/user2.svg';
import CharityIcon from '../assets/svg/donation_money.svg';
import colors from '../theme/color';
import { AccountLimitsTypes } from '../types';

export const _transferMethods = [
  {
    id: 1,
    title: 'Rayyan Transfer',
    subtitle: 'Fast and free transfers.',
    link: 'Transfer',
  },
  {
    id: 2,
    title: 'Other Bank Transfer',
    subtitle: 'Transfer to a bank account number.',
    icon: 'Bank',
    link: 'OtherBanks',
  },
];

export const _transferTypes = [
  { id: 1, title: 'My Account', icon: 'UserTick' },
  { id: 2, title: 'Rayyan Account', icon: 'Courthouse' },
  { id: 3, title: 'Other Bank', icon: 'Bank' },
  // { id: 3, title: 'Standing Order', icon: 'RepeatCircle' },
];

export const _supports = [
  {
    id: 1,
    title: 'FAQ',
    subtitle: 'We have already answered most of your questions.',
    icon: 'MessageQuestion',
    link: 'Faq',
  },
  {
    id: 2,
    title: "Bank's Address",
    subtitle:
      'No. 2, Sanda Kyarimi Complex, Shehu Laminu Way, Maiduguri Borno State.',
    icon: 'Bank',
    key: 'bank',
    // link: `https://wa.me/${phoneNumber}`,
    external: true,
  },
  {
    id: 3,
    title: 'Email Address',
    subtitle: 'customercare@rayyanbank.com.ng',
    icon: 'Sms',
    key: 'email',
    link: `mailto:${emailAddress}`,
    external: true,
  },
  {
    id: 4,
    title: 'Contact Number',
    subtitle: '02014142923',
    icon: 'Call',
    key: 'call',
    link: `tel:${phoneNumber}`,
    external: true,
  },
];
export const _requestOptions = [
  {
    id: 1,
    title: 'Card Request',
    subtitle: 'We have already answered most of your questions.',
    icon: 'CardReceive',
  },
];

export const _socialNetworks = [
  {
    id: 1,
    title: '@rayyanbank',
    img: require('../assets/img/x.png'),
    link: 'https://twitter.com/rayyanbank',
    external: true,
  },
  {
    id: 2,
    title: '@rayyanbank.ng',
    img: require('../assets/img/instagram.png'),
    link: 'https://www.instagram.com/rayyanbank.ng',
    external: true,
  },
  {
    id: 3,
    title: '@rayyanbank',
    img: require('../assets/img/facebook.png'),
    link: 'https://www.facebook.com/profile.php?id=61550051434651&is_tour_dismissed=true',
    external: true,
  },
  {
    id: 4,
    title: 'www.rayyanbank.com.ng',
    link: 'https://www.rayyanbank.com.ng',
    img: require('../assets/img/website.png'),
    external: true,
  },
];

export const _miscellaneous = [
  {
    id: 1,
    title: 'Rate Us',
    icon: 'Star1',
    external: true,
    key: 'rate',
  },
];

export const _txnCategory = [
  {
    id: 1,
    title: 'General',
    icon: BoxIcon,
  },
  {
    id: 2,
    title: 'Home',
    icon: HomeIcon,
  },
  {
    id: 3,
    title: 'Education',
    icon: Mortarboard,
  },
  {
    id: 4,
    title: 'Personal',
    icon: UserIcon,
  },
  {
    id: 5,
    title: 'Charity',
    icon: CharityIcon,
  },
];

export const _menu = [
  {
    id: 1,
    title: 'Accounts',
    services: [
      {
        id: 1,
        name: 'Account Summary',
        bgcolor: '#D9DC3F',
        color: colors.amberYellow,
        icon: 'DocumentText',
        link: 'AccountSummary',
      },
      {
        id: 2,
        name: 'Generate Statement',
        bgcolor: '#384AA8',
        color: colors.cyan,
        icon: 'DocumentDownload',
        link: 'GenerateStatement',
      },
      {
        id: 3,
        name: 'Account Cards',
        bgcolor: '#606060',
        color: colors.softGreen,
        icon: 'Cards',
      },
      {
        id: 4,
        name: 'Account Insight',
        bgcolor: '#ADEFD1',
        color: colors.royalBlue,
        icon: 'Activity',
        link: 'AccountInsight',
      },
      {
        id: 5,
        name: 'Upgrade Account',
        bgcolor: '#9CC4E3',
        color: colors.deepOrange,
        icon: 'StatusUp',
        link: 'AccountUpgrade',
      },
      {
        id: 6,
        name: 'Account Reactivation',
        color: colors.teal,
        bgcolor: '#97BC62',
        icon: 'ChartSuccess',
      },
      {
        id: 7,
        name: 'Service Request',
        color: colors.violet,
        bgcolor: '#97BC62',
        icon: 'DirectInbox',
        link: 'ServiceRequest',
      },
    ],
  },
  {
    id: 2,
    title: 'Transfers',
    services: [
      {
        id: 1,
        name: 'Own Account Transfer',
        bgcolor: '#C7D3D4',
        color: colors.skyBlue,
        icon: 'User',
        link: 'Transfer',
        type: 'self',
      },
      {
        id: 2,
        name: 'Rayyan Transfer',
        bgcolor: '#9CC3D5',
        color: colors.deepOrange,
        icon: 'Courthouse',
        link: 'Transfer',
        type: 'rayyan',
      },
      {
        id: 3,
        name: 'Other Bank Transfer',
        bgcolor: '#97BC62',
        color: colors.softGreen,
        icon: 'Bank',
        link: 'Transfer',
        type: 'other',
      },
      {
        id: 4,
        name: 'Bulk Bank Transfer',
        bgcolor: '#97BC62',
        color: colors.cyan,
        icon: 'Buildings2',
        link: 'BulkTransfer',
        type: 'other',
      },
      {
        id: 5,
        name: 'Approval',
        bgcolor: '#97BC62',
        color: colors.sunsetOrange,
        icon: 'ClipboardTick',
        link: 'BatchRequests',
        nested: 'BulkDetails',
        type: 'other',
      },
      {
        id: 6,
        name: 'Manage Beneficiary',
        bgcolor: '#A2A2A1',
        color: colors.royalBlue,
        icon: 'Profile2User',
        link: 'Beneficiaries',
      },
      {
        id: 7,
        name: 'Standing Order',
        bgcolor: '#A2A2A1',
        color: colors.violet,
        icon: 'RepeatCircle',
        link: 'StandingOrderScreen',
      },
    ],
  },
  {
    id: 3,
    title: 'Bills Payment',
    access: 'retail',
    services: [
      {
        id: 1,
        name: 'Airtime',
        bgcolor: '#DAA03D',
        color: colors.softGreen,
        icon: 'CallCalling',
        link: 'AirtimeData',
      },
      {
        id: 4,
        name: 'Data Top-Up',
        bgcolor: '#343148',
        color: colors.violet,
        icon: 'Mobile',
        link: 'BillsPage',
        details: {
          categoryId: '4',
        },
      },
      {
        id: 2,
        name: 'TV',
        bgcolor: '#CBCE91',
        color: colors.amberYellow,
        icon: 'Courthouse',
        link: 'BillsPage',
        details: {
          categoryId: '2',
        },
      },
      {
        id: 3,
        name: 'Electricity',
        bgcolor: '#f4b41a',
        color: colors.sunsetOrange,
        icon: 'LampCharge',
        link: 'BillsPage',
        details: {
          categoryId: '1',
        },
      },
      {
        id: 5,
        name: 'Bills History',
        bgcolor: '#2C5F2D',
        color: colors.teal,
        icon: 'MenuBoard',
        link: 'TransactionHistory',
      },
      {
        id: 6,
        name: 'Manage Beneficiary',
        bgcolor: '#C7D3D4',
        color: colors.skyBlue,
        icon: 'Profile2User',
        link: 'BillBeneficiaries',
      },
    ],
  },
  {
    id: 4,
    title: 'Security',
    services: [
      {
        id: 1,
        name: 'Manage PIN',
        bgcolor: '#9CC4E3',
        color: colors.amberYellow,
        icon: 'Lock1',
        link: 'MaintainPin',
      },
      {
        id: 2,
        name: 'Change Password',
        bgcolor: '#7C7C7C',
        color: colors.skyBlue,
        icon: 'KeySquare',
        link: 'ChangePassword',
      },
      {
        id: 3,
        name: 'Maintain Security Quest',
        bgcolor: '#03FF95',
        color: colors.softGreen,
        icon: 'SecuritySafe',
        link: 'SecurityQuestions',
      },
    ],
  },
];

export const _settings = [
  {
    id: 1,
    title: 'Security',
    services: [
      {
        id: 1,
        name: 'Manage PIN',
        bgcolor: '#ADEFD1',
        color: colors.softGreen,
        icon: 'KeySquare',
        link: 'MaintainPin',
      },
      {
        id: 2,
        name: 'Change Password',
        icon: 'PasswordCheck',
        link: 'ChangePassword',
        bgcolor: '#606060',
        color: colors.royalBlue,
      },
      {
        id: 3,
        name: 'Maintain Security Quest',
        bgcolor: '#384AA8',
        color: colors.amberYellow,
        icon: 'ShieldSecurity',
        link: 'SecurityQuestions',
      },
      {
        id: 4,
        name: 'Transaction Limit',
        bgcolor: '#D9DC3F',
        color: colors.sunsetOrange,
        icon: 'Setting3',
        link: 'TransactionLimit',
      },
      {
        id: 4,
        name: 'Account Limit',
        bgcolor: '#D9DC3F',
        color: colors.cyan,
        icon: 'Stickynote',
        link: 'AccountLimit',
      },
    ],
  },
  {
    id: 2,
    title: 'Preferences',
    services: [
      {
        id: 1,
        name: `Theme & ${'\n'}Preferences`,
        bgcolor: '#C7D3D4',
        color: colors.skyBlue,
        icon: 'ColorSwatch',
        link: 'Theme',
      },
      {
        id: 2,
        name: 'Account Analytics',
        bgcolor: '#9CC3D5',
        color: colors.amberYellow,
        icon: 'Chart2',
        link: 'AccountInsight',
      },
      {
        id: 3,
        name: 'Accounts & Transactions',
        bgcolor: '#97BC62',
        color: colors.cyan,
        icon: 'Moneys',
        link: 'Transfer',
      },
      {
        id: 4,
        name: 'Login & Dashboard',
        color: colors.violet,
        bgcolor: '#A2A2A1',
        icon: 'MoreSquare',
        link: '',
      },
    ],
  },
  {
    id: 3,
    title: 'Session',
    services: [
      {
        id: 1,
        name: 'Log Out',
        bgcolor: '#DAA03D',
        color: colors.deepOrange,
        icon: 'Logout',
        link: 'logout',
      },
    ],
  },
];

export const _theme = [
  {
    id: 1,
    title: 'Change Theme',
    subtitle: 'Switch Between Light and Dark Modes',
    icon: 'MessageQuestion',
    key: 'faq',
    external: true,
  },
];

export const _transactionLimit = [
  {
    id: 1,
    title: 'Adjust Current Limit',
    subtitle: 'Update your existing transaction cap',
    icon: 'Setting3',
    key: 'setLimit',
    link: 'SetTransactionLimit',
  },
  {
    id: 2,
    title: 'Request Limit Upgrade',
    subtitle: 'Apply for a higher transaction threshold',
    icon: 'StatusUp',
    key: 'upgradeLimit',
    link: 'UpgradeTransactionLimit',
  },
];

export const _features = [
  {
    id: 1,
    name: 'History',
    icon: 'Calendar2',
    link: 'TransactionHistory',
    color: colors.amberYellow,
  },
  {
    id: 2,
    name: 'Insight',
    icon: 'StatusUp',
    link: 'AccountInsight',
    color: colors.cyan,
  },
  {
    id: 3,
    name: 'Summary',
    icon: 'DocumentText',
    link: 'AccountSummary',
    color: colors.deepOrange,
  },
  {
    id: 4,
    name: 'Request',
    icon: 'DirectInbox',
    link: 'ServiceRequest',
    color: colors.teal,
  },
  {
    id: 5,
    name: 'Statement',
    icon: 'DocumentDownload',
    link: 'GenerateStatement',
    color: colors.primary,
  },
  {
    id: 6,
    name: 'Beneficiary',
    icon: 'Profile2User',
    link: 'Beneficiaries',
    color: colors.violet,
  },
  {
    id: 7,
    name: 'Manage PIN',
    icon: 'Lock1',
    link: 'MaintainPin',
    color: colors.softGreen,
  },
  {
    id: 8,
    name: 'More',
    icon: 'Category2',
    link: 'Menu',
    color: colors.royalBlue,
  },
];

export const sourcesOfIncome = [
  'Salaries/Wages',
  'Freelancing',
  'Online Businesses (e-commerce, blogging)',
  'Real Estate (Rental income)',
  'Agriculture (farming, livestock)',
  'Transportation (e.g., Uber, Bolt drivers)',
  'Commission-based Sales',
  'Mobile Money Services',
  'Affiliate Marketing',
  'Trading',
  'Consulting/Coaching',
  'Social Media Influencing',
  'Content Creation (YouTube, TikTok, Blogging)',
  'Franchise Business',
  'Dropshipping',
  'Event Planning/Management',
  'Nigerian Government Grants & Subsidies',
  'Remittances from Family Abroad',
  'Investment in Startups',
  'Health and Beauty Services (e.g., salons, spas)',
  'Art & Music (e.g., royalties, performances)',
  'Pension/Retirement Benefits',
  'Mobile App Development',
  'Tech Startups & Innovation',
  'Gifts and Donations',
  'Inheritance',
];

export const statesInNigeria = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'Federal Capital Territory (FCT)',
];

export const meansOfIdentification = [
  'National ID Card',
  'International Passport',
  "Driver's License",
  "Voter's Card",
];

export const accountLimits: AccountLimitsTypes = [
  {
    tier: 'Tier 1',
    limits: [
      { title: 'Single Credit Limit', value: '₦50,000.00' },
      { title: 'Daily Credit Limit', value: '₦300,000.00' },
      { title: 'Single Debit Limit', value: '₦50,000.00' },
      { title: 'Daily Debit Limit', value: '₦300,000.00' },
      { title: 'Max Cumulative Balance', value: '₦300,000.00' },
    ],
  },
  {
    tier: 'Tier 2',
    limits: [
      { title: 'Single Credit Limit', value: '₦100,000.00' },
      { title: 'Daily Credit Limit', value: '₦600,000.00' },
      { title: 'Single Debit Limit', value: '₦100,000.00' },
      { title: 'Daily Debit Limit', value: '₦500,000.00' },
      { title: 'Max Cumulative Balance', value: '₦600,000.00' },
    ],
  },
  {
    tier: 'Tier 3',
    limits: [
      { title: 'Single Credit Limit', value: 'Unlimited' },
      { title: 'Daily Credit Limit', value: 'Unlimited' },
      { title: 'Single Debit Limit', value: '₦500,000.00' },
      { title: 'Daily Debit Limit', value: '₦5,000,000.00' },
      { title: 'Max Cumulative Balance', value: 'Unlimited' },
    ],
  },
];

export const accountUpgradeRequirements = [
  {
    tier: 'Tier 2',
    fields: [
      { name: 'NIN Number', type: 'string' },
      { name: 'Source of Income', type: 'string' },
      { name: 'Place of Work', type: 'string' },
      { name: 'Work Address', type: 'string' },
      { name: 'Work Address State', type: 'string' },
      { name: 'Mode of Identification', type: 'string' },
      { name: 'ID Image', type: 'image' },
      { name: 'Photo Image', type: 'image' },
      { name: 'Signature Image', type: 'Image' },
    ],
  },
  {
    tier: 'Tier 3',
    fields: [
      { name: 'Maiden Name', type: 'string' },
      { name: 'Next of Kin', type: 'string' },
      { name: 'Proof of Address', type: 'image' },
    ],
  },
];
