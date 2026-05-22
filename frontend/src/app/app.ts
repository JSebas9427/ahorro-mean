import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { ProyeccionService } from './services/proyeccion.service';
import { Proyeccion } from './models/proyeccion.model';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';

Chart.register(
  ...registerables
);
@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BaseChartDirective
  ],

  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App
  implements OnInit {

  proyecciones:
    Proyeccion[] = [];
  proyeccionesFiltradas:
    Proyeccion[] = [];
  textoBusqueda = '';

  totalRegistros = 0;
  cumplenMeta = 0;
  promedioAhorro = 0;
  mayorAhorro = 0;
  porcentajeCumplen = 0;
  formulario: any;
  ahorroTotal = 0;
  diferenciaMeta = 0;
  cumpleMeta = false;
  modoEdicion = false;
  idEditando = '';
  public barChartType:
    ChartType = 'bar';

  public ahorroMetaData:
    ChartConfiguration<'bar'>['data']
    = {

      labels: [

        'Ahorro Total',

        'Meta'
      ],

      datasets: [

        {

          data: [0, 0],

          label:
            'Comparación'
        }
      ]

    };
  public lineaChartType:
    ChartType = 'line';

  public crecimientoData:
    ChartConfiguration<'line'>['data']
    = {

      labels: [],

      datasets: [

        {

          data: [],

          label:
            'Crecimiento del ahorro'
        }
      ]
    };
  public historialChartType:
    ChartType = 'bar';

  public historialData:
    ChartConfiguration<'bar'>['data']
    = {

      labels: [],

      datasets: [

        {

          data: [],

          label:
            'Ahorro total'
        }
      ]
    };

  constructor(

    private fb:
      FormBuilder,

    private proyeccionService:
      ProyeccionService,

    private cdr:
      ChangeDetectorRef,

    private toastr:
      ToastrService


  ) {

    this.formulario =
      this.fb.group({

        nombre: [

          '',

          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],

        ahorroMensual: [

          0,

          [
            Validators.required,
            Validators.min(1)
          ]
        ],

        meses: [

          1,

          [
            Validators.required,
            Validators.min(1)
          ]
        ],

        meta: [

          0,

          [
            Validators.required,
            Validators.min(1)
          ]
        ],

        gastosFijos: [

          0,

          [
            Validators.min(0)
          ]
        ],

        gastosVariables: [

          0,

          [
            Validators.min(0)
          ]
        ]
      });
  }

  ngOnInit(): void {

    this.cargarProyecciones();
  }

  cargarProyecciones() {

    this.proyeccionService
      .obtenerProyecciones()
      .subscribe({

        next: (
          data: Proyeccion[]
        ) => {

          console.log(data);

          this.proyecciones = [...data];
          this.calcularMetricas();
          this.proyeccionesFiltradas =
            data;

          this.cdr.detectChanges();
        },

        error: (err: any) => {

          console.error(err);
        }
      });

  }

  calcularProyeccion() {

    console.log(
      this.formulario.value
    );

    const datos =
      this.formulario.value;

    const ahorroMensual =

      Number(
        datos.ahorroMensual
      );

    const gastosFijos =

      Number(
        datos.gastosFijos
      );

    const gastosVariables =

      Number(
        datos.gastosVariables
      );

    const meses =

      Number(
        datos.meses
      );

    const meta =

      Number(
        datos.meta
      );

    console.log({
      ahorroMensual,
      gastosFijos,
      gastosVariables,
      meses,
      meta
    });

    const ahorroMensualNeto =

      ahorroMensual
      - gastosFijos
      - gastosVariables;

    console.log(
      'Ahorro neto:',
      ahorroMensualNeto
    );


    this.ahorroTotal =

      ahorroMensualNeto
      * meses;

    this.diferenciaMeta =

      this.ahorroTotal
      - meta;

    this.cumpleMeta =

      this.ahorroTotal
      >= meta;
    this.actualizarGrafica();
    this.actualizarGraficaCrecimiento();
    this.actualizarGraficaHistorial();
    this.actualizarDashboard();

    console.log({
      ahorroTotal:
        this.ahorroTotal,

      diferencia:
        this.diferenciaMeta,

      cumple:
        this.cumpleMeta
    });

    this.toastr.success(
      'Toast funcionando',
      'Éxito'
    );
  }

  actualizarGrafica() {

    this.ahorroMetaData = {

      labels: [

        'Ahorro Total',

        'Meta'
      ],

      datasets: [

        {

          data: [

            this.ahorroTotal,

            this.formulario
              .value.meta || 0
          ],

          label:
            'Ahorro vs Meta'
        }
      ]
    };
  }

  actualizarGraficaCrecimiento() {

    const meses =

      Number(
        this.formulario
          .value.meses
      ) || 0;

    const ahorroMensual =

      Number(
        this.formulario
          .value.ahorroMensual
      ) || 0;

    const gastosFijos =

      Number(
        this.formulario
          .value.gastosFijos
      ) || 0;

    const gastosVariables =

      Number(
        this.formulario
          .value.gastosVariables
      ) || 0;

    const ahorroNeto =

      ahorroMensual
      - gastosFijos
      - gastosVariables;

    const labels = [];

    const data = [];

    let acumulado = 0;

    for (
      let i = 1;
      i <= meses;
      i++
    ) {

      acumulado +=
        ahorroNeto;

      labels.push(
        `Mes ${i}`
      );

      data.push(
        acumulado
      );
    }

    this.crecimientoData = {

      labels,

      datasets: [

        {

          data,

          label:
            'Crecimiento del ahorro'
        }
      ]
    };
  }
  actualizarGraficaHistorial() {

    const nombres =

      this.proyecciones.map(

        p => p.nombre
      );

    const ahorros =

      this.proyecciones.map(

        p => p.ahorroTotal
      );

    this.historialData = {

      labels:
        nombres,

      datasets: [

        {

          data:
            ahorros,

          label:
            'Ahorro total'
        }
      ]
    };
  }
  actualizarDashboard() {

    this.totalRegistros =

      this.proyecciones.length;

    this.cumplenMeta =

      this.proyecciones.filter(

        p => p.cumpleMeta
      ).length;

    const totalAhorros =

      this.proyecciones.reduce(

        (
          suma,
          p
        ) =>

          suma
          +
          p.ahorroTotal,

        0
      );

    this.promedioAhorro =

      this.totalRegistros > 0

        ?

        totalAhorros
        /
        this.totalRegistros

        :

        0;

    this.mayorAhorro =

      this.totalRegistros > 0

        ?

        Math.max(

          ...this.proyecciones.map(

            p =>
              p.ahorroTotal
          )
        )

        :

        0;

    this.porcentajeCumplen =

      this.totalRegistros > 0

        ?

        Math.round(

          (
            this.cumplenMeta
            /
            this.totalRegistros
          )
          * 100
        )

        :

        0;
  }

  calcularMetricas() {

    this.totalRegistros =

      this.proyecciones.length;

    this.cumplenMeta =

      this.proyecciones.filter(

        p => p.cumpleMeta
      ).length;

    if (
      this.proyecciones.length
      > 0
    ) {

      const suma =

        this.proyecciones.reduce(

          (acc, p) =>

            acc +
            p.ahorroTotal,

          0
        );

      this.promedioAhorro =

        suma
        /
        this.proyecciones.length;
    }
  }
  filtrarProyecciones() {

    const texto =

      this.textoBusqueda
        .toLowerCase()
        .trim();

    this.proyeccionesFiltradas =

      this.proyecciones.filter(

        p =>

          p.nombre
            .toLowerCase()
            .includes(texto)
      );
  }
  ordenarMayorAhorro() {

    this.proyeccionesFiltradas =

      [
        ...this.proyeccionesFiltradas
      ]

        .sort(

          (a, b) =>

            b.ahorroTotal
            -
            a.ahorroTotal
        );
  }

  ordenarMenorAhorro() {

    this.proyeccionesFiltradas =

      [
        ...this.proyeccionesFiltradas
      ]

        .sort(

          (a, b) =>

            a.ahorroTotal
            -
            b.ahorroTotal
        );
  }

  ordenarNombre() {

    this.proyeccionesFiltradas =

      [
        ...this.proyeccionesFiltradas
      ]

        .sort(

          (a, b) =>

            a.nombre.localeCompare(
              b.nombre
            )
        );
  }
  guardarProyeccion() {

    const datos =
      this.formulario.value;

    const nuevaProyeccion:
      Proyeccion = {

      uidFirebase: 'temporal',

      emailUsuario:
        'temporal@gmail.com',

      nombre: datos.nombre,

      ahorroMensual:
        datos.ahorroMensual,

      meses:
        datos.meses,

      meta:
        datos.meta,

      gastosFijos:
        datos.gastosFijos,

      gastosVariables:
        datos.gastosVariables,

      ahorroTotal:
        this.ahorroTotal,

      diferenciaMeta:
        this.diferenciaMeta,

      cumpleMeta:
        this.cumpleMeta
    };

    this.proyeccionService
      .crearProyeccion(
        nuevaProyeccion
      )
      .subscribe({

        next: () => {

          this.toastr.success(

            'La proyección fue guardada correctamente',

            'Guardado'
          );

          this.cargarProyecciones();

          this.formulario.reset();

          this.ahorroTotal = 0;

          this.diferenciaMeta = 0;

          this.cumpleMeta = false;

        },

        error: (err) => {

          console.error(err);
        }
      });
  }
  editarProyeccion(
    proyeccion: Proyeccion
  ) {

    this.modoEdicion = true;

    this.idEditando =
      proyeccion._id || '';

    this.formulario.patchValue({

      nombre:
        proyeccion.nombre,

      ahorroMensual:
        proyeccion.ahorroMensual,

      meses:
        proyeccion.meses,

      meta:
        proyeccion.meta,

      gastosFijos:
        proyeccion.gastosFijos,

      gastosVariables:
        proyeccion.gastosVariables
    });

    this.ahorroTotal =
      proyeccion.ahorroTotal;

    this.diferenciaMeta =
      proyeccion.diferenciaMeta;

    this.cumpleMeta =
      proyeccion.cumpleMeta;
  }
  actualizarProyeccion() {
    this.toastr.info(

      'La proyección fue actualizada',

      'Actualizado'
    );
    const datos =
      this.formulario.value;

    const proyeccionActualizada:
      Proyeccion = {

      uidFirebase:
        'temporal',

      emailUsuario:
        'temporal@gmail.com',

      nombre:
        datos.nombre,

      ahorroMensual:
        Number(datos.ahorroMensual),

      meses:
        Number(datos.meses),

      meta:
        Number(datos.meta),

      gastosFijos:
        Number(datos.gastosFijos),

      gastosVariables:
        Number(datos.gastosVariables),

      ahorroTotal:
        this.ahorroTotal,

      diferenciaMeta:
        this.diferenciaMeta,

      cumpleMeta:
        this.cumpleMeta
    };

    this.proyeccionService
      .actualizarProyeccion(

        this.idEditando,

        proyeccionActualizada
      )
      .subscribe({

        next: () => {

          this.toastr.info(

  'La proyección fue actualizada',

  'Actualizado'
);

          this.cargarProyecciones();

          this.formulario.reset();

          this.modoEdicion =
            false;

          this.idEditando = '';

          this.ahorroTotal = 0;

          this.diferenciaMeta = 0;

          this.cumpleMeta = false;
        },

        error: (err) => {

          console.error(err);
        }
      });
  }
  eliminarProyeccion(
    id: string
  ) {

    const confirmar =

      confirm(

        '¿Seguro que deseas eliminar esta proyección?'
      );

    if (
      !confirmar
    ) return;
    
    this.proyeccionService
      .eliminarProyeccion(id)
      .subscribe({

        next: () => {

          this.cargarProyecciones();
          this.toastr.warning(

  'La proyección fue eliminada',

  'Eliminado'
);
        },

        error: (err) => {

          console.error(err);

          alert(
            'Error al eliminar'
          );
        }
      });
  }

  trackById(
    index: number,
    item: Proyeccion
  ) {

    return item._id;
  }
}