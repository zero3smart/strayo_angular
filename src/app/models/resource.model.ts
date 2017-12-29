import * as ol from 'openlayers';

export interface IResource {
    id: number;
    type: string;
    url: string;
    status: string;
}

export class Resource extends ol.Object {
    public id(): number;
    public id(id: number): this;
    public id(id?: number): number | this {
        if (id !== undefined) {
            this.set('id', id);
            return this;
        }
        return this.get('id');
    }

    public status(): string;
    public status(status: string): this;
    public status(status?: string): string | this {
        if (status !== undefined) {
            this.set('status', status);
            return this;
        }
        return this.get('status');
    }

    public type(): string;
    public type(type: string): this;
    public type(type?: string): string | this {
        if (type !== undefined) {
            this.set('type', type);
            return this;
        }
        return this.get('type');
    }

    public url(): string;
    public url(url: string): this;
    public url(url?: string): string | this {
        if (url !== undefined) {
            this.set('url', url);
            return this;
        }
        return this.get('url');
    }
}
