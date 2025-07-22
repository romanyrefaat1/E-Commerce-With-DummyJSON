"use client";

import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Shield, Truck, RotateCcw, Share2, Trash, Minus, Plus } from "lucide-react";
import { Button, ButtonAsLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncrementAndDecrementAllButtons from "../../cart/_components/increment-and-decrement-all-buttons";
import makeFirstLetterUpperCase from "@/lib/utils/makeFirstLetterUpperCase";

export default function ProductDetailPage() {
  const { id } = useParams();
  const {
    removeProductFromCart,
    getIsProductInCart,
  } = useCart();
  const { getProductDataByProductId, loading, error } = useProducts();
  const [product, setProduct] = useState(null);

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await getProductDataByProductId(id);
      console.log(data);

      if (!data.id) {
        console.warn("Fetched product data is missing an id:", data);
      }
      setProduct(data);
    };
    fetchProducts();
  }, [id, getProductDataByProductId]);

  const isProductInCart = getIsProductInCart(id);

  // Initialize count from product.cart_count or 0
  const [count, setCount] = useQueryState("count", {
    parse: Number,
    defaultValue: product?.cart_count ? Number(product.cart_count) : 0,
  });

  // Keep count in sync when product updates
  useEffect(() => {
    if (product?.cart_count) {
      setCount(Number(product.cart_count));
    }
  }, [product, setCount]);

  // Handle loading and error states
  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error loading products: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const relatedProducts = [
    { id: 2, name: "Wireless Earbuds Pro", price: 199, image: "/placeholder.svg?height=200&width=200", rating: 4.7 },
    { id: 3, name: "Bluetooth Speaker", price: 149, image: "/placeholder.svg?height=200&width=200", rating: 4.6 },
    { id: 4, name: "Audio Cable Premium", price: 29, image: "/placeholder.svg?height=200&width=200", rating: 4.5 },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href={"/products"+product.category}>{makeFirstLetterUpperCase(product.category)}</Link>
            </li>
            <li className="text-base-content/70">{makeFirstLetterUpperCase(product.title)}</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-base-200 max-h-[400px] md:max-h-[500px] w-full">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg bg-base-200 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2">
              {
                product.tags.map((tag)=> (
                  <Badge variant="secondary" className="mb-2">
                {tag}
              </Badge>
                ))
              }
              </div>
              <h1 className="text-3xl font-playfair font-bold mb-2">{product.title}</h1>
              <p className="text-base-content/70 mb-4">by {product.brand}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? "fill-warning text-warning" : "text-base-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm">{product.rating}</span>
                </div>
                <span className="text-sm text-base-content/70">({product.reviews.length} reviews)</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-title">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-base-content/50 line-through">${product.originalPrice}</span>
                    <Badge className="bg-error text-error-content">Save ${product.originalPrice - product.price}</Badge>
                  </>
                )}
              </div>

              <p className="text-base-content/80 leading-relaxed mb-6">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-success" : "bg-error"}`}></div>
              <span className={`font-medium ${product.inStock ? "text-success" : "text-error"}`}>
                {product.inStock ? `In Stock (${product.stockCount} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <Button variant="outline" size="sm" onClick={()=> setCount(prev=> prev < 1 ? prev : prev - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                          
                  <span className="px-4 py-2 border-t border-b border-base-300 min-w-[60px] text-center">{product.cart_count || count}</span>
                  <Button variant="outline" size="sm" onClick={()=> setCount(prev => prev + 1)}><Plus className="h-4 w-4" /></Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  // size="lg" 
                  variant={isProductInCart ? "destructive" : "default"}
                  onClick={() => {
                    if (isProductInCart) {
                      removeProductFromCart(product.id);
                      return;
                    }
                    
                    if (!product.id) {
                      console.error("Trying to add product with missing ID:", product);
                      return;
                    }
                    let endCount = count;
                    if (endCount < 1) {
                      console.log("detected count < 1");
                      endCount = 1;
                      setCount(1);
                    }
                    updateProductInCart(product, endCount);
                  }}
                  className="w-fit"
                >
                  {isProductInCart ? (
                    <span className="flex items-center">
                      <Trash className="w-5 h-5 mr-2"/>
                      Remove from cart
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 mr-2 font-bold" />
                      Add to Cart
                    </span>
                  )}
                </Button>
                
                <ButtonAsLink
                 size="lg"
                //  variant="outline"
                 className="flex-1 border-primary hover:bg-primary bg-transparent"
                  href={`/checkout?productId=${id}`}
                >
                  Buy Now
                </ButtonAsLink>
                <Button size="lg" variant="ghost">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="ghost">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Key Features</h3>
              <ul className="space-y-2">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-base-200">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">{product.warrantyInformation || "No warranty"}</div>
                  <div className="text-xs text-base-content/70">Full coverage</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Free Shipping</div>
                  <div className="text-xs text-base-content/70">Orders over $100</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">{product.returnPolicy}</div>
                  <div className="text-xs text-base-content/70">No questions asked</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.rating})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-base-content/80 leading-relaxed">{product.description}</p>
                <h4 className="font-semibold mt-6 mb-4">What's in the box:</h4>
                <ul className="space-y-2">
                  <li>• Premium Wireless Headphones</li>
                  <li>• USB-C Charging Cable</li>
                  <li>• 3.5mm Audio Cable</li>
                  <li>• Premium Carrying Case</li>
                  <li>• Quick Start Guide</li>
                  <li>• Warranty Card</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-base-200">
                    <span className="font-medium">{key}:</span>
                    <span className="text-base-content/70">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{product.rating}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? "fill-warning text-warning" : "text-base-300"}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-base-content/70 mt-1">{product.reviews} reviews</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-8">{rating}★</span>
                        <div className="flex-1 bg-base-200 rounded-full h-2">
                          <div className="bg-warning h-2 rounded-full" style={{ width: `${rating * 20}%` }}></div>
                        </div>
                        <span className="text-sm text-base-content/70 w-8">{rating * 20}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-playfair font-bold mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <figure className="relative overflow-hidden h-48">
                  <Image
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-sm">{relatedProduct.rating}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">${relatedProduct.price}</span>
                    <Button size="sm" variant="outline">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}