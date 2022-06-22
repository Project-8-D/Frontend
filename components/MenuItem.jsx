import Link from "next/link";

export default function MenuItem({ icon, text, href }) {
  return <Link href={href} passHref>
      <div className="flex items-center p-4 hover:bg-gray-700 active:bg-gray-600 cursor-default select-none">
        <i className="material-icons-round mr-2">{icon}</i>
        {text}
      </div>
    </Link>
}