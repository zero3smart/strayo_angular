import { Component, OnInit, Input } from '@angular/core';
import * as ol from 'openlayers';
import { Dataset } from '../../../../models/dataset.model';
import { Annotation } from '../../../../models/annotation.model';
import { AnnotationToolType } from '../../../../models/annotationToolType';
import { DomSanitizer } from '@angular/platform-browser';
import { Map3dService } from '../../../../services/map-3d.service';
import { IAnnotationToolMeta } from '../../../../models/annotationToolMeta';
import { annotationStyle } from '../../../../util/layerStyles';
import { listenOn } from '../../../../util/listenOn';

@Component({
  selector: 'app-dataset-annotation',
  templateUrl: './dataset-annotation.component.html',
  styleUrls: ['./dataset-annotation.component.css']
})

export class DatasetAnnotationComponent implements OnInit {
  @Input() dataset: Dataset;
  @Input() annotation: Annotation;
  meta: IAnnotationToolMeta;
  editMode: boolean;
  endPoints: ol.Feature[];
  annotationLayer: ol.layer.Vector;
  interactionDone: Function;
  interaction: ol.interaction.Modify;

  constructor(private sanitizer: DomSanitizer, private map3DService: Map3dService) { }

  ngOnInit() {
    const geometry = (this.annotation.data().item(0).getGeometry() as ol.geom.LineString);
    const type = geometry.getType();
    this.meta = (this.annotation.meta() as IAnnotationToolMeta);
    this.endPoints = geometry.getCoordinates().map((coord) => {
      return new ol.Feature({
        geometry: new ol.geom.Circle(coord, 3)
      });
    });

    const features = new ol.Collection([this.annotation.data().item(0), ...this.endPoints]);
    this.annotationLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features,
      }),
      style: annotationStyle,
    });
    this.annotationLayer.set('title', this.meta.name);

    this.map3DService.registerLayer(this.annotationLayer, this.dataset);
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.interaction = new ol.interaction.Modify({
        features: this.annotation.data(),
      });
      let off;
      this.interactionDone = listenOn(this.interaction, 'modifystart', (event) => {
        if (off) off();
        const feature = event.features.item(0);
        off = listenOn(feature.getGeometry(), 'change', (evt) => {
          const geom = (evt.target as ol.geom.LineString);
          geom.getCoordinates().forEach((coord, i) => {
            (this.endPoints[i].getGeometry() as ol.geom.Circle).setCenter(coord);
          });
        });
      });
      this.map3DService.addInteraction(this.interaction);
    } else {
      if (this.interactionDone) this.interactionDone();
      this.map3DService.removeInteraction(this.interaction);
    }
  }

}