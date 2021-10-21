
import { SetMetadata } from '@nestjs/common';

export const Perm = (perm: number) => SetMetadata('perm', perm);
