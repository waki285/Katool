import { APISelectMenuOption } from "discord-api-types/v10";

export const EmojiGenFonts: APISelectMenuOption[] = [
  {
    label: "Noto Sans Mono CJK JP Bold",
    value: "notosans-mono-bold",
    default: true,
  },
  {
    label: "M+ 1p black",
    value: "mplus-1p-black",
  },
  {
    label: "Rounded M+ 1p black",
    value: "rounded-x-mplus-1p-black",
  },
  {
    label: "IPAmj Mincho",
    value: "ipamjm",
  },
  {
    label: "Aoyagi Reisyo Shimo",
    value: "aoyagireisyoshimo",
  },
  {
    label: "LinLibertine Bold",
    value: "LinLibertine_RBah",
  },
];

export const EmojiGenColors: APISelectMenuOption[] = [
  {
    label: "#EC71A1",
    value: "EC71A1FF",
    default: true,
  },
  {
    label: "#3AB0C7",
    value: "3AB0C7FF",
  },
  {
    label: "#38BA91",
    value: "38BA91FF",
  },
  {
    label: "#EAA82A",
    value: "EAA82AFF",
  },
  {
    label: "#1111FF",
    value: "1111FFFF",
  },
  {
    label: "#00BB00",
    value: "00BB00FF",
  },
  {
    label: "#FF0000",
    value: "FF0000FF",
  },
  {
    label: "#000000",
    value: "000000FF",
  },
  {
    label: "#FFFFFF",
    value: "FFFFFFFF",
  },
  {
    label: "Custom",
    value: "custom",
  },
];
