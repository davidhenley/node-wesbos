import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import map from './modules/map';
import heart from './modules/heart';

autocomplete($('#address'), $('#lat'), $('#lng'));

typeAhead( $('.search') );

map( $('#map') );

const heartForms = $$('form.heart');
heartForms.on('submit', heart);
