import React from 'react';
import {
  Wheat,
  Hammer,
  Sparkles,
  Truck,
  Layers,
  Paintbrush,
  Wrench,
  Zap,
  Car,
  Home,
  Briefcase
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = "w-6 h-6" }) => {
  const norm = name.toLowerCase();

  if (norm.includes('खेती') || norm.includes('farm')) {
    return <Wheat className={className} />;
  }
  if (norm.includes('मजदूरी') || norm.includes('labour') || norm.includes('लेबर')) {
    return <Hammer className={className} />;
  }
  if (norm.includes('सफाई') || norm.includes('clean')) {
    return <Sparkles className={className} />;
  }
  if (norm.includes('डिलीवरी') || norm.includes('delivery')) {
    return <Truck className={className} />;
  }
  if (norm.includes('मिस्त्री') || norm.includes('mason')) {
    return <Layers className={className} />;
  }
  if (norm.includes('पेंटर') || norm.includes('paint')) {
    return <Paintbrush className={className} />;
  }
  if (norm.includes('प्लंबर') || norm.includes('plumb')) {
    return <Wrench className={className} />;
  }
  if (norm.includes('इलेक्ट्रिशियन') || norm.includes('बिजली') || norm.includes('electric')) {
    return <Zap className={className} />;
  }
  if (norm.includes('ड्राइवर') || norm.includes('गाड़ी') || norm.includes('drive')) {
    return <Car className={className} />;
  }
  if (norm.includes('घर') || norm.includes('घरेलू') || norm.includes('maid') || norm.includes('home')) {
    return <Home className={className} />;
  }

  return <Briefcase className={className} />;
};
