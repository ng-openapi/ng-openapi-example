import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {JsonClientExample} from '../examples/json-client-example/json-client-example';
import {YamlClientExample} from '../examples/yaml-client-example/yaml-client-example';
import {UrlClientExample} from '../examples/url-client-example/url-client-example';

@Component({
  selector: 'app-example-view',
  imports: [RouterLink, JsonClientExample, YamlClientExample, UrlClientExample],
  templateUrl: './example-view.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './example-view.css',
})
export class ExampleView {}
