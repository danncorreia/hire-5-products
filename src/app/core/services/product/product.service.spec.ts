import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { AuthService } from '@services/auth/auth.service';
import { Product } from '@models/product.interface';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  const apiUrl = 'http://rest-items.research.cloudonix.io/items';

  const mockToken = 'test-token';

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    sku: 'TEST-SKU-001',
    cost: 99.99,
    profile: {
      type: 'furniture'
    }
  };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthToken']);
    authServiceSpy.getAuthToken.and.returnValue(mockToken);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should fetch all products with auth headers', () => {
      const mockProducts: Product[] = [mockProduct];

      service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(mockProducts);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', () => {
      const newProduct: Omit<Product, 'id'> = {
        name: 'New Product',
        description: 'New Description',
        sku: 'NEW-SKU-001',
        cost: 149.99,
        profile: {
          type: 'furniture'
        }
      };

      service.createProduct(newProduct).subscribe(product => {
        expect(product).toEqual({ id: 1, ...newProduct });
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.body).toEqual(newProduct);
      req.flush({ id: 1, ...newProduct });
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', () => {
      const updateData: Partial<Product> = {
        name: 'Updated Name',
        cost: 199.99,
        profile: {
          type: 'furniture'
        }
      };

      service.updateProduct(1, updateData).subscribe(product => {
        expect(product).toEqual({ ...mockProduct, ...updateData });
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(req.request.body).toEqual(updateData);
      req.flush({ ...mockProduct, ...updateData });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', () => {
      service.deleteProduct(1).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush(null);
    });
  });
});
