import { Component } from './component';
import type { Schema } from '@colyseus/schema';

export abstract class NetworkComponent extends Component {
  abstract observe(schema: Schema): void;
}
