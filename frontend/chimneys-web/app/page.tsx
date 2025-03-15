import Link from "next/link";

async function getProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  return res.json();
}

export default async function Home() {
  const products: any[] = [];

  return (
      <div>
        {/*<h1>🏪 Магазин</h1>*/}
        {/*<ul>*/}
        {/*  {products.map((product) => (*/}
        {/*      <li key={product._id}>*/}
        {/*        <Link href={`/product/${product._id}`}>*/}
        {/*          {product.name} - ${product.price}*/}
        {/*        </Link>*/}
        {/*      </li>*/}
        {/*  ))}*/}
        {/*</ul>*/}
        {/*<Link href="/admin">Перейти до адмінки</Link>*/}
      </div>
  );
}
