import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package2, 
  CreditCard, 
  Wallet, 
  QrCode , 
  Building ,
  Lock,
  Package,
  Receipt,
  ShieldCheck,
  Shield,
  Truck
} from 'lucide-react';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function Checkout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Package2 className="h-6 w-6" />
            <span className="text-lg font-semibold">Smartdwell Technologies</span>
          </Link>
          {/* <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/products" className="hover:underline">Products</Link>
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </nav> */}
        </div>
      </header>
      <main className="flex-1 container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-6">
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
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
                <Label htmlFor="zip">Zip</Label>
                <Input id="zip" placeholder="12345" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="payment">Payment Method</Label>
                <RadioGroup id="payment" defaultValue="credit-card">
                  <div className="flex items-center gap-4">
                    <RadioGroupItem id="credit-card" value="credit-card" />
                    <Label htmlFor="credit-card" className="flex items-center">
                      <CreditCard className="h-6 w-6 mr-2" />
                      Credit Card
                    </Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <RadioGroupItem id="paypal" value="paypal" />
                    <Label htmlFor="paypal" className="flex items-center">
                      <Wallet className="h-6 w-6 mr-2" />
                      PayPal
                    </Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <RadioGroupItem id="apple-pay" value="apple-pay" />
                    <Label htmlFor="apple-pay" className="flex items-center">
                      <Building className="h-6 w-6 mr-2" />
                      Net Banking
                    </Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <RadioGroupItem id="google-pay" value="google-pay" />
                    <Label htmlFor="google-pay" className="flex items-center">
                      <QrCode className="h-6 w-6 mr-2" />
                      Google Pay
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="col-span-2">
                <Button type="submit" className="w-full">
                  Place Order
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$99.99</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$5.99</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-500">-$10.00</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>$95.98</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                <span>1 x Acme Widget</span>
                <span className="ml-auto">$99.99</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                <span>1 x Acme Gadget</span>
                <span className="ml-auto">$99.99</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-500" />
              <span>Estimated delivery: 3-5 business days</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-gray-500" />
              <span>Secure checkout with SSL encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-gray-500" />
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-500" />
              <span>Your payment information is securely stored and encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-500" />
              <span>Fraud protection and buyer protection included</span>
            </div>
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