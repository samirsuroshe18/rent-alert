import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package2 } from 'lucide-react';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function Checkout() {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsTermsAccepted(e.target.checked);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Package2 className="h-6 w-6" />
            <span className="text-lg font-semibold">Smartdwell Technologies</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex justify-center items-center py-12 px-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <form className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" rows={3} placeholder="123 Main St, Anytown USA" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Anytown" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="CA" />
              </div>
              <div>
                <Label htmlFor="pin">Pincode</Label>
                <Input id="pin" placeholder="400001" />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input type="number" id="amount" placeholder="₹" />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4"
                  checked={isTermsAccepted}
                  onChange={handleCheckboxChange}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the <Link to="/terms" className="text-blue-500 underline">terms and conditions</Link>
                </Label>
              </div>
              <div className="col-span-2">
                <Button type="submit" className="w-full" disabled={!isTermsAccepted}>
                  Place Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">&copy; 2024 Smartdwell Technologies. All rights reserved.</p>
          <nav className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/support" className="hover:underline">Support</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default Checkout;
