import{a as c,j as t}from"./index-BvX-wDj0.js";import{L as g}from"./constants-kCfQ7fEp.js";const d=({compact:a=!1})=>{const{i18n:r,t:n}=c(),s=r.language,i=e=>{r.changeLanguage(e)};return t.jsx("div",{className:`flex items-center justify-center ${a?"gap-1":"gap-2"}`,role:"radiogroup","aria-label":n("common.selectLanguage"),children:g.map(e=>{const o=s===e.code;return t.jsx("button",{onClick:()=>i(e.code),role:"radio","aria-checked":o,"aria-label":e.label,className:`
              ${a?"px-3 py-1.5 text-sm":"px-4 py-2 text-base"}
              rounded-full font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
              ${o?"bg-green-600 text-white shadow-sm":"bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"}
            `,children:e.nativeLabel},e.code)})})};export{d as L};
