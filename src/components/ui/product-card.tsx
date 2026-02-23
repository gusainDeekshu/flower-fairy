import { Star, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  price: number;
  rating: number;
}

export function ProductCard({ name, price, rating }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl border-slate-100 shadow-sm relative">
      <Button variant="ghost" size="icon" className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white">
        <Heart size={16} />
      </Button>
      
      <div className="h-32 w-full bg-emerald-50 relative flex items-center justify-center text-emerald-200 text-xs">
        {/* Replace with next/image */}
        Image Placeholder
      </div>
      
      <CardContent className="p-3 pb-0">
        <h4 className="text-xs font-bold text-slate-800 truncate">{name}</h4>
      </CardContent>
      
      <CardFooter className="p-3 pt-2 flex items-center justify-between">
        <span className="text-sm font-bold text-primary">₹{price}</span>
        <div className="flex items-center text-[10px] text-slate-500">
          <Star size={10} className="fill-yellow-400 text-yellow-400 mr-1" />
          {rating}
        </div>
      </CardFooter>
    </Card>
  );
}