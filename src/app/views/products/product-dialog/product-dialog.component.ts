import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product, ProductProfile } from '@models/product.interface';
import { ProductService } from '@services/product/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '@views/shared/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { CustomPropertiesComponent } from './components/custom-properties/custom-properties.component';
import { makeProduct } from '@dtos/product.dto';

export interface DialogData {
  product?: Product;
}

@Component({
  selector: 'dialog-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIconModule,
    CustomPropertiesComponent
  ],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {
  #dialogRef = inject(MatDialogRef<ProductDialogComponent>);
  #data = inject<DialogData>(MAT_DIALOG_DATA);
  #formBuilder = inject(FormBuilder);
  #productService = inject(ProductService);
  #dialog = inject(MatDialog);

  product = signal(this.#data.product);
  isEditing = signal(false);
  isCreating = signal(!this.#data.product);
  customProperties = signal<{ key: string; value: string }[]>([]);

  readonly productTypes = ['furniture', 'equipment', 'stationary', 'part'] as const;

  productForm = this.#formBuilder.group({
    name: [{value: '', disabled: true}, [Validators.required]],
    description: [{value: '', disabled: true}, [Validators.required]],
    sku: [{value: '', disabled: true}, [Validators.required]],
    cost: [{value: 0, disabled: true}, [Validators.required, Validators.min(0)]],
    profile: this.#formBuilder.group({
      type: [{value: 'furniture', disabled: true}],
      available: [{value: true, disabled: true}],
      backlog: [{value: 0, disabled: true}]
    })
  });

  ngOnInit(): void {
    if (this.product()) {
      this.loadProduct();
    } else {
      this.enableEditing();
    }
  }

  private loadProduct(): void {
    const product = this.product();
    if (!product) return;

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      sku: product.sku,
      cost: product.cost,
      profile: {
        type: product.profile.type || 'furniture',
        available: product.profile.available ?? true,
        backlog: product.profile.backlog || 0
      }
    });

    this.customProperties.set(
      Object.entries(product.profile)
        .filter(([key]) => !['type', 'available', 'backlog'].includes(key))
        .map(([key, value]) => ({ key, value: String(value) }))
    );
  }

  enableEditing(): void {
    this.isEditing.set(true);
    this.productForm.enable();
    if (!this.isCreating()) {
      this.productForm.get('sku')?.disable();
    }
  }

  disableEditing(): void {
    this.isEditing.set(false);
    this.productForm.disable();
  }

  addCustomProperty(): void {
    this.customProperties.update(props => [...props, { key: '', value: '' }]);
  }

  removeCustomProperty(index: number): void {
    this.customProperties.update(props => props.filter((_, i) => i !== index));
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.getRawValue();
      const profile: ProductProfile = {
        type: formValue.profile?.type as ProductProfile['type'],
        available: formValue.profile?.available ?? true,
        backlog: formValue.profile?.backlog ?? 0
      };

      this.customProperties().forEach(prop => {
        if (prop.key.trim()) {
          profile[prop.key] = prop.value;
        }
      });

      const product: Omit<Product, 'id'> = {
        name: formValue.name!,
        description: formValue.description!,
        sku: formValue.sku!,
        cost: formValue.cost!,
        profile
      };

      if (this.isCreating()) {
        this.#productService.createProduct(product).subscribe({
          next: () => this.onClose(true)
        });
      } else {
        this.#productService.updateProduct(this.product()!.id, makeProduct(product)).subscribe({
          next: () => this.onClose(true)
        });
      }
    }
  }

  onCancel(): void {
    if (this.isCreating()) {
      this.onClose();
    } else {
      this.disableEditing();
      this.loadProduct();
    }
  }

  onClose(resp: any = null): void {
    this.#dialogRef.close(resp);
  }

  onDelete(): void {
    if (this.product()) {
      this.openConfirmDialog('Are you sure you want to delete this product?').subscribe(result => {
        if (result) {
          this.#productService.deleteProduct(this.product()!.id).subscribe({
            next: () => this.onClose(true)
          });
        }
      });
    }
  }

  openConfirmDialog(text: string): Observable<boolean> {
    const dialog = this.#dialog.open(ConfirmDialogComponent, {
      data: { text },
      width: '30rem',
    });

    return dialog.afterClosed();
  }
}
