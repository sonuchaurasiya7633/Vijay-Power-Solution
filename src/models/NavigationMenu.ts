import mongoose, { Schema, Document, Model } from "mongoose";

export interface INavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
  sortOrder: number;
  children?: { label: string; href: string }[];
}

export interface INavigationMenu extends Document {
  location: "header" | "footer_services" | "footer_solutions" | "footer_areas" | "footer_legal";
  items: INavigationItem[];
  updatedAt: Date;
}

const NavigationMenuSchema = new Schema<INavigationMenu>(
  {
    location: {
      type: String,
      enum: ["header", "footer_services", "footer_solutions", "footer_areas", "footer_legal"],
      required: true,
      unique: true,
    },
    items: [
      {
        label: { type: String, required: true },
        href: { type: String, required: true },
        isExternal: { type: Boolean, default: false },
        sortOrder: { type: Number, default: 0 },
        children: [
          {
            label: { type: String, required: true },
            href: { type: String, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const NavigationMenu: Model<INavigationMenu> =
  mongoose.models.NavigationMenu ||
  mongoose.model<INavigationMenu>("NavigationMenu", NavigationMenuSchema);
export default NavigationMenu;
