import {it, iit, describe, ddescribe, expect, inject, injectAsync, TestComponentBuilder, beforeEachProviders} from 'angular2/testing';
import {provide} from 'angular2/core';
import {SchemasListCmp} from './schemas_list';


describe('SchemasListCmp Component', () => {

  beforeEachProviders((): any[] => []);


  it('should ...', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       return tcb.createAsync(SchemasListCmp).then((fixture) => { fixture.detectChanges(); });
     }));

});
