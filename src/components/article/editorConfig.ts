
import { 
  Bold, Italic, Underline, Link as LinkIcon, 
  List, ListOrdered, Quote, Code, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight
} from "lucide-react";

export const formatButtons = [
  {
    icon: Bold,
    label: "Bold",
    beforeText: "**",
    afterText: "**"
  },
  {
    icon: Italic,
    label: "Italic",
    beforeText: "_",
    afterText: "_"
  },
  {
    icon: ListOrdered,
    label: "Numbered List",
    beforeText: "1. ",
    afterText: ""
  },
  {
    icon: List,
    label: "Bullet List",
    beforeText: "* ",
    afterText: ""
  },
  {
    icon: Quote,
    label: "Quote",
    beforeText: "> ",
    afterText: ""
  },
  {
    icon: Code,
    label: "Code",
    beforeText: "```\n",
    afterText: "\n```"
  }
];
