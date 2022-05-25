export default function MenuItem({ icon, text, href }) {
  return <a href={href} className="flex items-center p-4 hover:bg-gray-700 active:bg-gray-600 cursor-default select-none">
      <i className="material-icons-round mr-2">{icon}</i>
      {text}
    </a>
}