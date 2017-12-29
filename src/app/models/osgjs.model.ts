export interface OSGJSScene {
    Generator: string;
    Version: number;
    'osg.Node': OSGJSNode;
}

export interface OSGJSNode {
    Children: OSGJSNode[];
    UniqueID?: number;
    Name?: string;

}

export interface OSGJSGeometry {
    UniqueID: number;
    StateSet: {
        'osg.StateSet': OSGJSStateSet
    };
}

export interface OSGJSStateSet {
    UniqueID: number;
    AttributeList: any[];
    RenderingHint: string;
    TextureAttributeList: OSGJSTextureAttribute[][];
}

export interface OSGJSTextureAttribute {
    'osg.Texture': OSGJSTexture;
}

export interface OSGJSTexture {
    UniqueID: number;
    File: string;
}
