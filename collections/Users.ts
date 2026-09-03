import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  labels: {
    singular: { ar: "مستخدم", en: "User" },
    plural: { ar: "المستخدمون", en: "Users" },
  },
  admin: {
    useAsTitle: "email",
    group: { ar: "الإعدادات", en: "Settings" },
  },
  fields: [
    { name: "name", type: "text", required: true, label: { ar: "الاسم", en: "Name" } },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      label: { ar: "الصلاحية", en: "Role" },
      options: [
        { label: { ar: "مدير", en: "Admin" }, value: "admin" },
        { label: { ar: "محرّر", en: "Editor" }, value: "editor" },
      ],
    },
  ],
};
