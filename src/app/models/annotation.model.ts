import * as ol from 'openlayers';

class Annotation extends ol.Object {

    public data(): ol.Collection<ol.Feature> | ol.Feature;
    public data(data: ol.Collection<ol.Feature> | ol.Feature): this;
    public data(data?: ol.Collection<ol.Feature> | ol.Feature): ol.Collection<ol.Feature> | ol.Feature | this {
        if (data !== undefined) {
            this.set('data', data);
            return this;
        }
        return this.get('data');
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

    public isPhantom(): boolean;
    public isPhantom(isPhantom: boolean): this;
    public isPhantom(isPhantom?: boolean): boolean | this {
        if (isPhantom !== undefined) {
            this.set('is_phantom', isPhantom);
            return this;
        }
        return this.get('is_phantom');
    }

    public meta(): {};
    public meta(meta: {}): this;
    public meta(meta?: {}): {} | this {
        if (meta !== undefined) {
            this.set('meta', meta);
            return this;
        }
        return this.get('meta');
    }

    public resources(): string[];
    public resources(resources: string[]): this;
    public resources(resources?: string[]): string[] | this {
        if (resources !== undefined) {
            this.set('resources', resources);
            return this;
        }
        return this.get('resources');
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
}
