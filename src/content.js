// 이미지 원본은 public/images/에 넣고 /public/images/파일명 또는 HTTPS URL을 지정하세요.
// dist/는 빌드 결과물이므로 직접 수정하지 않습니다. 같은 파일 교체 시 ?v= 값을 변경하세요.
// 빈 이름이나 URL을 가진 일반 링크는 표시하지 않습니다.
export const linkPage = {
  profile: {
    name: '녹 nowk',
    logoText: 'nowk',
    imageSrc: '/public/images/links_profile.jpg?v=2',
    imageAlt: 'nowk 프로필 이미지',
    bio: 'Core, Not More\nFRAGRANCE LIFESTYLE BRAND',
  },
  signup: {
    label: '자사몰 1초 가입하기',
    href: 'https://nowk.co.kr/login?back_url=L3Nob3BfbXlwYWdlLz9tMj1vcmRlcg==&used_login_btn=N',
    title: 'nowk MEMBERS ONLY',
    description: '회원에게만 열리는 혜택',
    benefits: [
      { icon: 'dollar', text: '회원가입 즉시 3,000원 적립금' },
      { icon: 'gift', text: '멤버십 등급별 다양한 혜택' },
      { icon: 'calendar', text: '매월 새롭게 제공되는 자사몰 전용 혜택' },
      { icon: 'cake', text: '생일 고객 10% 할인 쿠폰' },
      { icon: 'kakao-talk', text: '카카오채널 추가 시 5% 할인 쿠폰' },
    ],
  },
  contact: {
    collaborationLabel: '협업 제안',
    email: 'contact@nowk.co.kr',
    instagram: 'https://www.instagram.com/nowk_official/',
    store: 'https://nowk.co.kr/',
  },
  archive: {
    title: 'ARCHIVE',
    links: [
      {
        id: 'project', layout: 'card', label: 'PROJECT',
        href: 'https://nowk.co.kr/project',
        imageSrc: '/public/images/seoul-life-thumb.png',
        imageAlt: 'nowk 프로젝트 전시',
      },
      {
        id: 'cyber-times', label: 'CYBER TIMES | NOWK',
        href: 'https://www.cybertimes.co.kr/news/view.php?idx=32738',
        imageSrc: '/public/images/times_icon.jpg',
        imageAlt: 'CYBER TIMES',
      },
    ],
  },
  links: [
    // 이름·URL을 입력하면 표시합니다. 이미지는 imageSrc: '/public/images/파일명'을 추가하세요.
    // layout: 'card'는 큰 이미지 카드, 미지정은 왼쪽 썸네일입니다. caption으로 보조 문구를 추가할 수 있습니다.
    {
      id: 'black-friday',
      layout: 'card',
      label: '[11.27-12.5] nowk BLACK FRIDAY',
      caption: 'UP TO 42%',
      href: 'https://nowk.co.kr/shop-all',
      imageSrc: '/public/images/BF_banner2_16_9.png',
      imageAlt: 'nowk BLACK FRIDAY',
    },
    {
      id: 'fragrance-sachet',
      layout: 'card',
      label: '[NEW] FRAGRANCE SACHET',
      href: 'https://nowk.co.kr/shop-home',
      imageSrc: '/public/images/_16_904-Single-Product_n02.png',
      imageAlt: 'nowk FRAGRANCE SACHET',
    },
    {
      id: 'kakao-gift',
      label: '카카오톡 선물하기',
      href: 'https://gift.kakao.com/brand/20388',
      imageSrc: '/public/images/kakako_icon.jpg?v=2',
      imageAlt: '카카오톡 선물하기',
    },
    {
      id: '29cm',
      label: '29CM',
      href: 'https://www.29cm.co.kr/store/brand/124061?brandId=124061&page=1',
      imageSrc: '/public/images/29CM_icon.jpg',
      imageAlt: '29CM',
    },
    {
      id: 'qoo10-japan',
      label: 'Qoo10 JAPAN',
      href: 'https://www.qoo10.jp/shop/nowk?cit=1215760070',
      imageSrc: '/public/images/Qoo10_icon.jpg',
      imageAlt: 'Qoo10 JAPAN',
    },
  ],
};
