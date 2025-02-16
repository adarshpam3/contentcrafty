
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Table,
  Image as ImageIcon,
  Code,
  Quote,
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
    beforeText: "*",
    afterText: "*"
  },
  {
    icon: Underline,
    label: "Underline",
    beforeText: "__",
    afterText: "__"
  },
  {
    icon: Strikethrough,
    label: "Strike",
    beforeText: "~~",
    afterText: "~~"
  },
  {
    icon: LinkIcon,
    label: "Link",
    beforeText: "[",
    afterText: "](url)"
  },
  {
    icon: AlignLeft,
    label: "Align Left",
    beforeText: "",
    afterText: ""
  },
  {
    icon: AlignCenter,
    label: "Align Center",
    beforeText: "",
    afterText: ""
  },
  {
    icon: AlignRight,
    label: "Align Right",
    beforeText: "",
    afterText: ""
  },
  {
    icon: List,
    label: "Bullet List",
    beforeText: "- ",
    afterText: ""
  },
  {
    icon: ListOrdered,
    label: "Numbered List",
    beforeText: "1. ",
    afterText: ""
  },
  {
    icon: Table,
    label: "Table",
    beforeText: "\n| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n",
    afterText: ""
  },
  {
    icon: ImageIcon,
    label: "Image",
    beforeText: "![Alt text](",
    afterText: ")"
  },
  {
    icon: Code,
    label: "Code",
    beforeText: "`",
    afterText: "`"
  },
  {
    icon: Quote,
    label: "Quote",
    beforeText: "> ",
    afterText: ""
  }
];
