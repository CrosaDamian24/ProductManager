import fs from "fs";

class ProductManager {
  #error;
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
    this.#error = undefined;
  }
  //Genero ID
  generateId = async () => {
    const products = await this.getProducts();
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  };

  //Busqueda por ID
  getProductById = async (id) => {
    const products = await this.getProducts();
    const product = products.find((item) => item.id === id);
    return console.log(!product ? "Not Found" : product);
  };

    //Busqueda por KEY
    getProductByKey  = async (value, key) => {
        const products = await this.getProducts();

        const product = products.filter((item) => item[key] === value);
    
        return console.log(product.length === 0 ? "Not Found" : product);
      };
  //Borro por ID
  deleteProduct = async (id) => {
    const products = await this.getProducts();

    const found = products.find((item) => item.id === id);

    return found
      ? await fs.promises.writeFile(
          this.path,
          JSON.stringify(
            products.filter((item) => item.id !== id),
            null,
            "\t"
          )
        )
      : console.log("El ID NO existe");
  };

  //Actualizo por ID
  updateProduct = async (id, campo,contenido) => {
    const products = await this.getProducts(id);

    const found = products.find((item) => item.id === id);

    if (found) {
      const indiceElemento = products.findIndex((item) => item.id === id);

      products[indiceElemento] = {
        ...products[indiceElemento],
        [campo]: contenido,
      };

      return await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
    } else {
      console.log("No existe ese elemento a actualizar");
    }
  };

  #validateProduct = (title, description, price, thumbnail, code, stock) => {
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !thumbnail ||
      !code ||
      !stock
    ) {
      this.#error = `[${title}]: campos incompletos`;
      return;
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    this.#validateProduct(title, description, code, price, thumbnail, stock);

    if (this.#error === undefined) {
      const products = await this.getProducts();

      products.push({
        id: await this.generateId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
      return await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
    } else {
      console.log(this.#error);
    }
  };

  getProducts = async () => {
    return JSON.parse(await fs.promises.readFile(this.path, this.format));
  };
}

const manager = new ProductManager("./products.json");
//  await manager.addProduct("Postre Oreo",
//  "Oreos, crema y dulce de leche",
//  1000,
//  "https://d3ugyf2ht6aenh.cloudfront.net/stores/593/476/products/postre-oreo1-baebe795d818cd332016267243846221-640-0.png",
//  "10001",
//  50);
// await manager.addProduct( "Postre Toddy",
// "Galletitas toddy, dulce y crema",
// 950,
// "https://lh6.googleusercontent.com/-0FLFbk4padM/VFVS1Q6fz8I/AAAAAAAAZFc/qIZhiLBfbRU/s640/blogger-image--229646297.jpg",
// "10001",8);

// manager.getProducts()
//  manager.getProductById(2)
// await manager.deleteProduct(2)
// await manager.updateProduct(2, "title", "Postre Toddy");
//  await manager.getProductByKey(950, "price");
