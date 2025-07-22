import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NavbarLayout({children}: {children: React.ReactHTMLElement<any>}) {

    return (
        <div>
            <nav className="navbar bg-base-100 shadow-sm border-b border-base-200 px-6">
        <div className="navbar-start">
          <h4>
          <Link href="/" className="text-2xl font-playfair font-bold">
            TheEcomm
          </Link>
          </h4>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link href="/" className="font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="font-medium">
                Products
              </Link>
            </li>
            <li>
              <Link href="#" className="font-medium">
                Categories
              </Link>
            </li>
            <li>
              <Link href="#" className="font-medium">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-4 w-4" />
              {/* <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge> */}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-content bg-transparent"
          >
            Sign In
          </Button>
        </div>
      </nav>

        {children}
      
        </div>
    )
}