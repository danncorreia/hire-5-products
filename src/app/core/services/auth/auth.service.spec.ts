import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    const mockLocalStorage = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: 'Window', useValue: { localStorage: mockLocalStorage } }
      ]
    });

    service = TestBed.inject(AuthService);

    spyOn(window.localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(window.localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(window.localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should store token and emit new value', (done) => {
      const token = 'test-token';
      service.login(token);

      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', token);
      service.authToken$.subscribe(value => {
        expect(value).toBe(token);
        done();
      });
    });

    it('should throw error if token is empty', () => {
      expect(() => service.login('')).toThrowError('Token cannot be empty');
      expect(() => service.login('   ')).toThrowError('Token cannot be empty');
    });
  });

  describe('logout', () => {
    it('should remove token and emit null', (done) => {
      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
      service.authToken$.subscribe(value => {
        expect(value).toBeNull();
        done();
      });
    });
  });

  describe('getAuthToken', () => {
    it('should return current token', () => {
      const token = 'test-token';
      service.login(token);
      expect(service.getAuthToken()).toBe(token);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when authenticated', () => {
      service.login('test-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when not authenticated', () => {
      service.logout();
      expect(service.isAuthenticated()).toBeFalse();
    });
  });
});
