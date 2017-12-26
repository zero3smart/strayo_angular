import * as ol from 'openlayers';

export interface ISite {
    id: string;
    name: string;
    datasets: string;
}

export class Site extends ol.Object {
    public datasets(): number[];
    public datasets(datasets: number[]): this;
    public datasets(datasets?: number[]): number[] | this {
        if (datasets !== undefined) {
            this.set('datasets', datasets);
            return this;
        }
        return this.get('datasets');
    }

    public id(): number;
    public id(id: number): this;
    public id(id?: number): number | this {
        if (id !== undefined) {
            this.set('id', id);
            return this;
        }
        return this.get('id');
    }

    public name(): string;
    public name(name: string): this;
    public name(name?: string): string | this {
        if (name !== undefined) {
            this.set('name', name);
            return this;
        }
        return this.get('name');
    }
}