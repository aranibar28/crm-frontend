import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { CoursesRoutingModule } from './courses-routing.module';
import { UpdateCourseComponent } from './update-course/update-course.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { IndexCourseComponent } from './index-course/index-course.component';

@NgModule({
  declarations: [
    UpdateCourseComponent,
    CreateCourseComponent,
    IndexCourseComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CoursesRoutingModule,
  ],
})
export class CoursesModule {}
