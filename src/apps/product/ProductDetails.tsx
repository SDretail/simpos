import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Stack,
  Badge,
  Grid,
  GridItem,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { productService, ProductProduct } from '../../services/product';
import { NavigationBarGeneral } from '../pos/components/NavigationBar';
import { useMoneyFormatter } from '../../hooks';
import noImage from '../pos/components/ProductCard/noimage.svg';

const ProductDetails: React.FunctionComponent = () => {
  const params = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductProduct | any>(null);
  const toast = useToast();
  const { formatCurrency } = useMoneyFormatter();

  const getProduct = async (productId: string) => {
    try {
      // Fetch product by ID (using domain search as existing service pattern)
      const products = await productService.getProducts([['id', '=', parseInt(productId, 10)]]);
      if (products && products.length > 0) {
        setProduct(products[0]);
      } else {
         toast({
          title: 'Error',
          description: 'Product not found',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch product details',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (params.productId) {
      getProduct(params.productId);
    }
  }, [params.productId]);

  const productImage = useMemo(() => {
    if (!product?.image_128) {
      return noImage;
    }
    return `data:image/png;base64,${product.image_128}`;
  }, [product]);

  if (!product) {
    return null;
  }

  return (
    <>
      <NavigationBarGeneral />
      <Box height="calc(100vh - 112px)" overflowY="auto" bg="gray.50">
        <Container maxW="6xl" pt={8}>
            <Breadcrumb mb={4} fontSize="sm" color="gray.600">
            <BreadcrumbItem>
                <BreadcrumbLink as={RouterLink} to="/pos">
                POS
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
            </Breadcrumb>

          <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={8}>
            <GridItem>
              <Box bg="white" p={4} borderRadius="lg" shadow="sm">
                <Image
                  src={productImage}
                  alt={product.name}
                  borderRadius="md"
                  width="100%"
                  objectFit="contain"
                />
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Stack spacing={4}>
                  <Box>
                    <Heading as="h1" size="xl" mb={2}>
                      {product.name}
                    </Heading>
                    {product.default_code && (
                        <Badge colorScheme="blue" fontSize="md" px={2} py={0.5} borderRadius="md">
                            {product.default_code}
                        </Badge>
                    )}
                  </Box>

                  <Heading size="lg" color="brand.500">
                    {formatCurrency(product.lst_price, 'Product Price')}
                  </Heading>

                   <Grid templateColumns="repeat(2, 1fr)" gap={4} py={4} borderTop="1px" borderBottom="1px" borderColor="gray.100">
                        <Box>
                            <Text color="gray.500" fontSize="sm">Barcode</Text>
                            <Text fontWeight="medium">{product.barcode || 'N/A'}</Text>
                        </Box>
                        <Box>
                            <Text color="gray.500" fontSize="sm">Category</Text>
                            <Text fontWeight="medium">{product.pos_categ_id ? product.pos_categ_id[1] : 'Uncategorized'}</Text>
                        </Box>
                         <Box>
                            <Text color="gray.500" fontSize="sm">Available Quantity</Text>
                             <Text fontWeight="medium" color={product.qty_available > 0 ? "green.600" : "red.600"}>
                                {product.qty_available}
                            </Text>
                        </Box>
                        <Box>
                             <Text color="gray.500" fontSize="sm">Type</Text>
                            <Text fontWeight="medium" textTransform="capitalize">{product.type}</Text>
                        </Box>
                   </Grid>
                </Stack>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ProductDetails;
