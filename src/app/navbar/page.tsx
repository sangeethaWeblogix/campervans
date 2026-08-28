 import { Suspense } from "react"
import Navbar from "./Navbar"

export const dynamic = "force-dynamic";

export default function Home() {
  return (
  <Suspense fallback={null}>
      <Navbar />
    </Suspense>
  )
}