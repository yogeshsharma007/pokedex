import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  data: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pokedex';
  pokemons: Array<any> = [];
  result: Array<any> = [];
  dataload: boolean = false;
  length = 300;
  pageSize = 10;
  searchString = ""
  pageSizeOptions: number[] = [10, 20, 50];

  constructor(private http: HttpClient,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.refresh()
  }

  async refresh() {
    this.dataload = false;
    this.pokemons = [];
    this.result = [];

    for (let index = 1; index <= 300; index++) {
      fetch('https://pokeapi.co/api/v2/pokemon/' + index.toString())
        .then(async data => {

          var tempData = await data.json();
          // console.log(tempData)

          var temp = await fetch(tempData["species"]["url"]);
          let pokemonDesc = await temp.json();

          var tempType = [];
          tempData['types'].forEach(element => {
            tempType.push(element.type.name)
          });

          var object = {
            id: index,
            name: tempData["name"],
            type: tempType,
            image: tempData["sprites"]["front_default"],
            desc: pokemonDesc["flavor_text_entries"][9]["flavor_text"],
            stats: tempData['stats']
          }

          this.pokemons.push(object)

          if (index == 300) {
            this.dataload = true;
            this.pokemons = this.pokemons.sort(((a: any, b: any) => { return a.id - b.id }));
            this.result = this.pokemons.slice(0, 10)
          }
        });

    }
  }

  onPage(data: any) {
    var x = data.pageSize * data.pageIndex;
    var y = x + data.pageSize;
    this.result = this.pokemons.slice(x, y)
  }

  onImage(data: any) {
    this.dialog.open(PokedexDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        data: data,
      },
    });
  }

  onSearch(data: any) {
    this.result = [];
    if (data.length > 0) {

      var string = data.toLowerCase()
      var pokemonName;
      var re = new RegExp(string, "g");

      this.pokemons.forEach(pokemon => {
        pokemonName = pokemon.name.toString().toLowerCase();

        if (pokemonName.search(re) == -1) {
        } else {
          this.result.push(pokemon);
        }
      });

    }
    else {
      this.refresh();
    }

  }
}

import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'pokedex-dialog',
  templateUrl: 'pokedex-dialog.html',
  styleUrls: ['./pokedex-dialog.css']

})
export class PokedexDialogComponent {

  pokemon: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
  public dialogRef: MatDialogRef<PokedexDialogComponent>) { 
    this.pokemon = data['data'];
    console.log(this.pokemon)
  }

  onCancel() {
    this.dialogRef.close();
  }
  

}
