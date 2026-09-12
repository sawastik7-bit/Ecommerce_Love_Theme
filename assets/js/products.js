// Ethereal Boutique - Product Catalog Data
// Shared source of truth for shop grid + product detail + cart.

export const PRODUCTS = [
  {
    id: "aura-silk-slip-dress",
    name: "Aura Silk Slip Dress",
    price: 245.0,
    size: "M",
    color: "Blush",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWIF8uifTU-cNClzPLwPrUnpHA1KQHMNcwjSICY1qC-Z7G4uR3Dih_uM3H6ljm1ZW_PB3wRSDA78iahkitF958C3TFs-ZeXsQfEvuFokRzPDjIPpetJb6JPAy6pjt3iDZf9HJGcP5goFTCanesdXAvGamehJgrZgjQmMbPIf_Qh-gOTveCOezfds421K6K1zCIpsRzfuHwTFjauFSiRE7O9GhSV4PanwTj59o1Hl8EDp5XjGT059uS",
    detail: "product.html",
  },
  {
    id: "lumina-layered-chain",
    name: "Lumina Layered Chain",
    price: 110.0,
    size: "M",
    color: "Gold",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBW049nbkFibwUdwUjgYRm0x_v63YWM29AoX0T6oaW-AZd0IU0L4noPzMxgxD97y_Xn0H2FL7FDEmgBZCZzrGOpjk6sQ0bCywYyQP9HQGtxgUWEYz5VWH9P7Xz7o-PDlnh4Im7zLXr7S4rtiOLImkMVzyrKqsNCAwvYfk-_zmQ63UAibjMaIrEJXha6Gyb8dgdrl7exlIUx8nFvehfi3oS3-fQeAHnoq6saHFcOOajB3mUc-JCVQlT",
    detail: "product.html",
  },
  {
    id: "celeste-mini-satchel",
    name: "Celeste Mini Satchel",
    price: 380.0,
    size: "M",
    color: "Ivory",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5Z82hmwyQNCjftcgzrZChTrpBfeb1QD4N4ebUVJZVX5l_5dgZ1jCYCHNvqW7z4bZP_rTimvqp_cjPBz3n92e8DnHY09tQJ8peK3eBrAeaIgmvTAsVaEKDMugIuFQFSmPirKa-2EgWFdq9FQXujTsdvq-Ca3az_SBO0fRn_pZs6rtM6lG6hy3rQ7qy448FwY5r-DmJiXBP2RpRTBuVfBXNc2HE_VjBh-_bbqnFA_OEnl4Nvswbwj-y",
    detail: "product.html",
  },
  {
    id: "eos-pearl-drops",
    name: "Eos Pearl Drops",
    price: 85.0,
    size: "M",
    color: "Pearl",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBG1DnZHq8tVxHKVj2AuD1y0hAiz88iH-7cseg_Xkl7qKmq5ToiGahYx62w2u7b6GB9tI-HnXhv4Rc7nRegqul153KazYgcZZlHbiRFBpyk8zqVqWiMosdprHd7J2_XIj67jZo-MifsMySPdBAGqlgmuIj9tJWBuhVGbzjXT1Urkx_dSvM-ZpVi-rfoW_IoIXmP4_hvIb3-i3PsTbQp9UNow3LS7kaSj_H8z4GymM8oBFdnJxdvcdbP",
    detail: "product.html",
  },
  {
    id: "reverie-tulle-blouse",
    name: "Reverie Tulle Blouse",
    price: 195.0,
    size: "M",
    color: "Blush",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzz7YqGECF6b0WUuuYACzKY-WGBH2DAJJvNHCxaFhmcfDTi9dWXCZrECsL1KJJ8qZytj5hOuCVuYYoC_dNYgm9UwPCkZVOewzeNG6HLrISx3JWAWRynqvtG0ZL0jkygXvs4F0f-wem5gNkqpTowxgsIa7fW_4pEA-_v9pPd38gaABU1UcuntLa2WjyaQbUnCsILpRhVosRI2xOI49hqiVjEjhjxJ0DdTCzkiT5Fv51Pj_f5TFcU8TL",
    detail: "product.html",
  },
  {
    id: "solstice-sun-hat",
    name: "Solstice Sun Hat",
    price: 120.0,
    size: "M",
    color: "Cream",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAppem7ihH-TRWNpk7vRQij_T49XoFZxIkwOZEShuxnDyuOTh5n7aDERkL6F0eHNdBrZa2ljM82TvqO5cQCWUwbOw4XPjoK_cGtwrXrqoEOOGjx_M0JbNzyPS1tVykXhFWOUB7bhq870N4okigfB7RQTbDGLetQdf7N4X8j--zUS0pUnkUsdAnAkRwFQzML5gRRFtjotvbwZ6zw7y8OD_7qcGtkH6-NQ23aCJxfenm9Rmviz5RaRSWi",
    detail: "product.html",
    soldOut: true,
  },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
